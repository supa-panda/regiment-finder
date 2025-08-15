import { onSchedule } from 'firebase-functions/v2/scheduler'
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import Stripe from "stripe";
import cors from "cors";

const corsPublic = cors({origin: true});
const SibApiV3Sdk = require("sib-api-v3-typescript");

enum emailTemplate {
  REGIMENT_EXPIRED = 1,
  REGIMENT_EXPIRATION_NOTICE = 2
}

admin.initializeApp();
const db = getFirestore();

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const createCheckoutSession = onRequest(async (request, response) => {
  corsPublic(request, response, async () => {
    try {
      // eslint-disable-next-line
      const {user_id} = request.body;

      if (!user_id) {
        response.status(400).json({ error: "Missing user_id" });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: request.body.price_id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "https://regimentfinder.com/support/confirm",
        cancel_url: "https://regimentfinder.com/support/error",
        metadata: {
          user_id,
          active_until: request.body.active_until,
        },
      });

      response.json({ url: session.url });
      return;
    } catch (error) {
      logger.error("Error creating Checkout session:", error);
      response.status(500).json({ error: "Failed to create checkout session" });
      return;
    }
  });
});


//Webhook function to handle payment success
export const complete = onRequest(
  { cors: [/firebase\.com$/, "stripe.com"] },
  async (request, response) => {
  try {
    const sig = request.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig) {
      response.status(400).send("Missing Stripe signature");
      return;
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret.toString());
    } catch (err) {
      logger.error("Webhook signature verification failed:", err);
      response.status(400).send(`Webhook Error: ${err}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (!userId) {
        logger.error("User ID missing in metadata");
        response.status(400).send("User ID is missing");
        return;
      }

      logger.info("Payment succeeded for user:", userId);

      const regimentRef = db.collection("regiment").doc(userId);
      await regimentRef.set({
        premium: true,
        active_until: session.metadata?.active_until,
      }, { merge: true });

      logger.info("Updated Firestore document for user:", userId);
    }

    response.send("Webhook received!");
    return;
  } catch (error) {
    logger.error("Error processing webhook:", error);
    response.status(500).send("Internal Server Error");
    return;
  }
});

export const getDiscordInviteLink = onRequest(async (request, response) => {
  corsPublic(request, response, async () => {
    const discordBotToken = process.env.DISCORD_BOT_TOKEN;

    // or get invite link from query params
    const inviteLinkQuery = request.query.invite_link;

    if (!inviteLinkQuery) {
      response.status(400).json({ error: "Missing invite link" });
      return;
    }

    fetch(`https://discord.com/api/v10/invites/${inviteLinkQuery}`, {
      method: "GET",
      headers: {
        Authorization: `Bot ${discordBotToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        response.json({ data: data})
      })
      .catch((error) => {
        logger.error("Error creating Discord invite link:", error);
        response.status(500).json({ error: "Failed to create Discord invite link" });
      });
  })
})

export const notifyExpiredRegiments = onRequest(async (request, response) => {
  corsPublic(request, response, async () => {
    try {
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

      const snapshot = await db
        .collection("regiment")
        .where("updated", "<", sixtyDaysAgo)
        .get();

      if (snapshot.empty) {
        return response.json([]); // corrected
      }

      const docsToNotify = snapshot.docs.filter(doc => {
        const data = doc.data();
        return !data.expired; // false or undefined = not notified
      });

      const uids = docsToNotify.map(doc => doc.id);
      const uidToEmail = await getUserEmails(uids);
      let count = 0;

      for (const doc of docsToNotify) {
        const uid = doc.id;
        const email = uidToEmail[uid];

        await sendEmailToUser(
          email,
          "Your regiment listing has expired",
          emailTemplate.REGIMENT_EXPIRED
        );
        count++;

        await db.collection("regiment").doc(doc.id).update({
          expired: true,
          notifiedAt: new Date(),
        });
      }

      return response.json({ message: "Emails sent to users", count });
    } catch (error) {
      logger.error("Error fetching old regiments:", error);
      return response.status(500).json({ error: "Failed to fetch old regiments" });
    }
  });
});

export const regimentCleanup = onSchedule("every day 12:00", async (event) => {
  try {
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const snapshot = await db
      .collection("regiment")
      .where("updated", "<", sixtyDaysAgo)
      .get();

    if (snapshot.empty) {
      logger.info("No regiments to delete");
    }

    const docsToNotify = snapshot.docs.filter(doc => {
      const data = doc.data();
      return !data.expired; // false or undefined = not notified
    });

    const uids = docsToNotify.map(doc => doc.id);
    const uidToEmail = await getUserEmails(uids);
    let count = 0;

    for (const doc of docsToNotify) {
      const uid = doc.id;
      const email = uidToEmail[uid];

      await sendEmailToUser(
        email,
        "Your regiment listing has expired",
        emailTemplate.REGIMENT_EXPIRED
      );
      count++;

      await db.collection("regiment").doc(doc.id).update({
        expired: true,
        notifiedAt: new Date(),
      });
    }

    logger.log("Expiration emails sent to users", count);
  } catch (error) {
    logger.error("[ERROR] Expiration emails:", error);
  }
});

export const regimentExpirationNotice = onSchedule("every day 18:05", async (event) => {
  try {
    const now = Date.now();
    const fiftyDaysAgo = new Date(now - 50 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

    const snapshot = await db
      .collection("regiment")
      .where("updated", ">", sixtyDaysAgo)
      .where("updated", "<", fiftyDaysAgo)
      .get();

    if (snapshot.empty) {
      logger.info("No regiments to notify");
    }

    const docsToNotify = snapshot.docs.filter(doc => {
      const data = doc.data();
      return !data.notifiedAt; // false or undefined = not notified
    });

    const uids = docsToNotify.map(doc => doc.id);
    const uidToEmail = await getUserEmails(uids);
    let count = 0;

    for (const doc of docsToNotify) {
      const uid = doc.id;
      const email = uidToEmail[uid];

      await sendEmailToUser(
        email,
        "Your regiment listing is about to expire",
        emailTemplate.REGIMENT_EXPIRATION_NOTICE
      );
      count++;

      await db.collection("regiment").doc(doc.id).update({
        notifiedAt: new Date(),
      });
    }

    logger.log("Notify emails sent to users", count);
  } catch (error) {
    logger.error("[ERROR] Notify emails:", error);
  }
});

const sendEmailToUser = async (email: string, title: string, templateId: number) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.templateId = templateId
  sendSmtpEmail.subject = title;
  sendSmtpEmail.sender = { name: "RegimentFinder.com", email: "noreply@regimentfinder.com" };
  sendSmtpEmail.to = [{ email: email }];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: never) {
      logger.info(title + " email sent successfully");
    },
    function (error: never) {
      logger.error(error);
    }
  );
}

const getUserEmails = async (uids: string[]) => {
  const chunks = [];
  while (uids.length) chunks.push(uids.splice(0, 100));

  const allUserRecords = [];

  for (const chunk of chunks) {
    const result = await admin.auth().getUsers(
      chunk.map(uid => ({ uid }))
    );
    allUserRecords.push(...result.users);
  }

  return allUserRecords.reduce((map, user) => {
    map[user.uid] = user.email ?? '';
    return map;
  }, {} as Record<string, string>);
};


// ========== ADDITIONAL ADMIN API ROUTES ==========
import express, { Request, Response } from "express";
const userApi = express();
userApi.use(express.json());

// Only allow this specific domain
const allowedOrigins = ["https://admin.regimentfinder.com", "https://regiment-finder-admin.web.app/"];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      return callback(null, false);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
const corsMiddleware = cors(corsOptions);
userApi.use(corsMiddleware);

userApi.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Failed to fetch users", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch users", details: String(error) });
    }
  }
});

userApi.post("/api/user/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const user = await admin.auth().updateUser(uid, req.body);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Failed to update user", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to update user", details: String(error) });
    }
  }
});

userApi.delete("/api/user/:uid", async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Failed to delete user", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to delete user", details: String(error) });
    }
  }
});

userApi.get("/api/payments/getBalanceTransactions", async (req: Request, res: Response) => {
  try {
    const charges = await stripe.charges.list({ limit: 100 });

    const months: Record<string, { amount: number; date: Date }[]> = {};

    charges.data.forEach((tx) => {
      if (tx.status !== "succeeded") return;

      const date = new Date(tx.created * 1000);
      const monthKey = (date.getMonth() + 1).toString();

      if (!months[monthKey]) months[monthKey] = [];

      months[monthKey].push({
        amount: tx.amount,
        date,
      });
    });

    const monthlySums: Record<string, number> = {};
    Object.keys(months).forEach((month) => {
      const total = months[month].reduce((sum, tx) => sum + tx.amount, 0);
      monthlySums[month] = total / 100; // convert cents to currency
    });

    res.json({ monthlySums });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: "Failed to fetch balance transactions", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch balance transactions", details: String(error) });
    }
  }
});


export const api = onRequest(userApi);

async function listAllUsers(nextPageToken?: string): Promise<any[]> {
  const result = await admin.auth().listUsers(1000, nextPageToken);
  const users = result.users.map(user => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    disabled: user.disabled,
    createdAt: user.metadata.creationTime,
    lastLoginAt: user.metadata.lastSignInTime,
  }));

  if (result.pageToken) {
    const nextUsers = await listAllUsers(result.pageToken);
    return users.concat(nextUsers);
  }

  return users;
}
