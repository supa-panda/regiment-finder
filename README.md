# Regiment Finder

A lightweight, Vite-powered web app to browse and discover Foxhole regiments (with Discord integration and Firebase as the backend platform). All search and filtering runs **client-side in the browser** for snappy UX.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Building](#building)
- [Preview & Serve](#preview--serve)
- [Deployment (Firebase Hosting)](#deployment-firebase-hosting)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- 🔎 **Instant, client-side search & filters** (no external search providers).
- ⚡ **Fast SPA** built with **Vite**, modern JS/TS.
- ☁️ **Firebase project configuration** (keys provided via `.env`).
- 🛡️ **reCAPTCHA** support (configurable).
- 🤖 **Discord integration ready** (bot token via env).

---

## Tech Stack

- **Frontend:** Vite + modern JavaScript/TypeScript
- **Backend platform:** Firebase (project configuration via env)
- **Integrations:** Google reCAPTCHA, Discord (bot)
- **Package manager:** Any (npm, pnpm, yarn, bun) — use what you prefer; scripts are defined in `package.json`.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended)
- One of: **npm**, **pnpm**, **yarn**, or **bun**
- (Optional) **Firebase CLI** for deploys: `npm i -g firebase-tools`

### Install dependencies

```bash
# pick ONE:
npm install
# pnpm install
# yarn install
# bun install
```

---

## Environment Variables

Duplicate `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

These keys are expected by the app (all **must** be prefixed with `VITE_` so Vite can expose them to the client):

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=G-
VITE_RECAPTCHA_SITE_KEY=
VITE_RECAPTCHA_URL=
VITE_DISCORD_BOT_TOKEN=
```

> ⚠️ **Security note:** Any variable prefixed `VITE_` is embedded in the client bundle and is **public**. Never put true secrets in these values (e.g., long-lived Discord bot tokens or private API keys). If you need to call privileged APIs, use a server (or a serverless function) as a proxy and **do not** expose secrets in the frontend.

---

## Development

Start a local dev server with HMR:

```bash
# pick ONE:
npm run dev
# pnpm dev
# yarn dev
# bun dev
```

- Ensure your `.env` is present at repo root.
- reCAPTCHA will load using `VITE_RECAPTCHA_SITE_KEY` and `VITE_RECAPTCHA_URL`.
- Client-side search is automatic (no external services required).

---

## Building

Create a production build:

```bash
# pick ONE:
npm run build
# pnpm build
# yarn build
# bun run build
```

The output (typically `dist/`) is ready to be served by any static host (Firebase Hosting recommended below).

---

## Preview & Serve

Preview the production build locally:

```bash
# pick ONE:
npm run preview
# pnpm preview
# yarn preview
# bun run preview
```

---

## Deployment (Firebase Hosting)

1. **Login & init (first time):**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Choose your Firebase project.
   - Set the public directory to your Vite build output (commonly `dist`).
   - Configure single-page app rewrite to `index.html` (Yes).

2. **Build the app:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

> If you maintain multiple environments, use `firebase use <alias>` to switch projects.

## Deployment (local)

It is possible to setup a local firebase emulator and run the app that way. More about it in [firebase docs](https://firebase.google.com/docs/emulator-suite) 

---

## Troubleshooting

- **Blank page / 404 on deep links**  
  Ensure Firebase Hosting rewrites all routes to `index.html` (SPA mode).

- **Env values not picked up**  
  Confirm the file is named `.env` (not `.env.txt`) and keys are prefixed with `VITE_`.

- **Secrets in client**  
  Double-check you are not exposing true secrets like private bot tokens in `VITE_*` variables. Use backend functions if necessary.

---

## Contributing

PRs and issues are welcome!

1. Fork the repo and create a feature branch.
2. Keep PRs focused and include a description (and screenshots if UI changes).
3. Ensure the app builds before submitting.

---

## License

[MIT](./LICENSE)

