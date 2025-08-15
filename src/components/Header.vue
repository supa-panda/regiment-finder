<template>
  <header>
    <nav class="w-full p-5 pb-0 sm:pb-5">
      <div class="sm:grid sm:grid-cols-3 w-full sm:items-center items-start flex flex-col">
        <div class="flex flex-col justify-start items-start w-full sm:w-auto">
          <div class="p-card p-3 rounded-xs text-sm header-card-top w-full sm:w-auto">
            <router-link to="/" class="flex flex-col justify-start items-start">
              <div>
                <span class="slogan collie">Regiment</span>
                <span class="slogan warden">Finder</span>
              </div>
              <small class="foxhole">Join the regiment that fits your fight!</small>
            </router-link>
          </div>
          <div class="p-card p-3 rounded-xs text-sm header-card-bottom">
            <div class="flex gap-1 items-center">
              <small class="flex gap-1 items-center">Ran by <img src="@/assets/robertluvsgames.png" class="max-w-[1rem]" alt="Robertluvsgames"> RobertluvsGames</small>
              <a href="https://www.youtube.com/@RobertLovesGames" target="_blank">
                <Tag class="text-sm">
                  <i class="pi pi-icon pi-youtube" style="color: #FF0000"></i>
                </Tag>
              </a>
              <a href="https://discord.gg/NGXdVsdUUB" target="_blank">
                <Tag class="text-sm">
                  <i class="pi pi-icon pi-discord" style="color: #5865f2"></i>
                </Tag>
              </a>
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center w-full mt-4 sm:w-auto pt-4 sm:pt-0">

        </div>
        <div class="flex justify-end items-center absolute top-5 right-5 gap-2">
          <Search v-if="router.currentRoute.value.name === 'index'" />
          <div v-if="user" class="flex justify-end items-center gap-4">
            <Button severity="secondary" @click="userDrawerVisible = !userDrawerVisible" class="p-button-sm" icon="pi pi-bars" label="Menu"/>
          </div>
          <Button v-else @click="drawerVisible = !drawerVisible" class="p-button-sm" severity="secondary" icon="pi pi-user" label="Sign in" />
        </div>
      </div>
    </nav>
  </header>
  <Drawer v-model:visible="drawerVisible" :header="login ? 'Sign in' : 'Sign up'" position="right">
    <!-- login -->
    <div v-if="login" class="flex flex-col items-end gap-2">
      <button class="gsi-material-button" @click="signinPopup">
        <div class="gsi-material-button-state"></div>
        <div class="gsi-material-button-content-wrapper">
          <div class="gsi-material-button-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              style="display: block"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span class="gsi-material-button-contents">Sign in with Google</span>
          <span style="display: none">Sign in with Google</span>
        </div>
      </button>
      <Divider class="w-full">Or</Divider>
      <InputText v-model="email" placeholder="Email" class="w-full" />
      <Password
        v-model="password"
        name="password"
        placeholder="Password"
        class="w-full"
        :feedback="false"
        fluid
      />
      <small @click="forgotModal = !forgotModal" class="cursor-pointer hover:underline float-left">Forgot password?</small>
      <Message v-if="loginError" severity="error" class="w-full">
        {{ loginError }}
      </Message>
      <Message v-if="registerMessage" severity="success" class="w-full">
        {{ registerMessage }}
      </Message>
      <br />
      <Button @click="signin" :loading="loginLoading" label="Sign in" class="w-full" />
    </div>
    <!-- register -->
    <div v-else class="flex flex-col items-center gap-2">
      <button class="gsi-material-button" @click="signinPopup">
        <div class="gsi-material-button-state"></div>
        <div class="gsi-material-button-content-wrapper">
          <div class="gsi-material-button-icon">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              style="display: block"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span class="gsi-material-button-contents">Sign up with Google</span>
          <span style="display: none">Sign up with Google</span>
        </div>
      </button>
      <Divider class="w-full">Or</Divider>
      <InputText v-model="email" placeholder="Email" class="w-full" />
      <Password
        v-model="password"
        name="password"
        placeholder="Password"
        class="w-full"
        :feedback="false"
        fluid
      />
      <Password
        v-model="repeatPassword"
        name="repeatPassword"
        placeholder="Repeat password"
        class="w-full"
        :feedback="false"
        fluid
      />
      <Message v-if="registerError" severity="error" class="w-full">
        {{ registerError }}
      </Message>
      <br />
      <Button @click="emailSignUp" :loading="registerLoading" label="Sign up" class="w-full" />
    </div>
    <div class="flex justify-center items-center cursor-pointer hover:underline pt-5">
      <a @click="login = !login">{{ login ? "Don't have an account? Sign up!" : 'Go to sign in' }}</a>
    </div>
  </Drawer>
  <Drawer v-model:visible="userDrawerVisible" header="Menu" position="right">
    <div class="flex flex-col items-center gap-2 h-full">
      <router-link to="/manage" class="w-full" @click="userDrawerVisible = false">
        <Button label="Manage regiment" icon="pi pi-cog" class="w-full p-button-secondary" />
      </router-link>

      <router-link to="/support" class="w-full" @click="userDrawerVisible = false">
      <Button class="w-full flex p-button-secondary">
        <Tag severity="danger"><i class="pi pi-icon pi-heart-fill"></i></Tag>
        Support RegimentFinder
      </Button>
      </router-link>
      <br />
      <div class="flex items-end flex-1 w-full">
        <div class="flex flex-col gap-2 w-full items-center justify-center">
          <div v-if="user?.photoURL" class="flex gap-2 items-center justify-center">
            <img :src="user?.photoURL" class="w-12 h-12 rounded" referrerpolicy="no-referrer" />
            <small>Logged in as {{ user?.email }}</small>
          </div>
          <Tag v-else class="w-full p-2"><small>Logged in as {{ user?.email }}</small></Tag>
          <Button label="Logout" icon="pi pi-sign-out" severity="secondary" class="w-full" @click="logout" />
        </div>
      </div>
    </div>
  </Drawer>
  <Toast></Toast>

  <Dialog v-model:visible="forgotModal" modal header="Forgot password" :draggable="false" :closable="true" :dismissable-mask="true" :style="{ width: '25rem' }">
    <span>
      Enter your email address and we will send you a link to reset your password.
    </span>
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 pt-4 mb-4">
        <InputText v-model="resetEmail" placeholder="Email" class="w-full" />
        <Button :loading="resetLoading" @click="resetPassword" label="Send" class="w-full max-w-25" />
      </div>
      <Message v-if="resetSent" severity="success" class="w-full">
        Success! Check your email for a reset link.
      </Message>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/search.ts'
import { ref } from 'vue'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import { signInWithPopup, signOut, onAuthStateChanged, sendPasswordResetEmail, type User } from 'firebase/auth'
import router from '@/router'
import { db } from '@/firebase'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { sendEmailVerification } from 'firebase/auth'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRegimentStore } from '@/stores/regiment.ts'
import { auth } from "@/firebase";
import Search from '@/components/Search.vue'


const regimentStore = useRegimentStore()
const login = ref(true)
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const registerError = ref('')
const registerLoading = ref(false)
const loginLoading = ref(false)
const registerMessage = ref('')
const loginError = ref('')
// @ts-expect-error Todo: Fix this
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha()
const user = ref<User | null>(null)
const resetEmail = ref('')
const forgotModal = ref(false)
const resetLoading = ref(false)
const resetSent = ref(false)

const resetPassword = async () => {
  resetLoading.value = true
  resetSent.value = false
  await sendPasswordResetEmail(auth, resetEmail.value)
    .then(() => {
      resetSent.value = true
    })
    .catch(() => {
      resetSent.value = false
    })
    .finally(() => {
      resetLoading.value = false
    })
}

const emailSignUp = async () => {
  registerError.value = ''
  if (!email.value || !password.value) {
    registerError.value = 'Email and password are required'
    return
  }

  if (!email.value.includes('@')) {
    registerError.value = 'Invalid email'
    return
  }

  if (password.value.length < 6) {
    registerError.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== repeatPassword.value) {
    registerError.value = 'Passwords do not match'
    return
  }

  registerLoading.value = true
  const recaptchaResult = await recaptcha('signup')

  if (!recaptchaResult) {
    loginError.value = 'Recaptcha failed'
    registerLoading.value = false
    return
  }

  registerError.value = ''
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      registerLoading.value = false
      login.value = true
      registerMessage.value = 'Account created, please verify your email'
      // @ts-expect-error Todo: Fix this
      sendEmailVerification(auth.currentUser)

      if (auth) {
        signOut(auth)
      }

      registerError.value = ''
    })
    .catch((reason) => {
      registerLoading.value = false
      registerError.value = reason
    })
}

setPersistence(auth, browserLocalPersistence).catch((error) => console.error("Error setting persistence:", error));
onAuthStateChanged(auth, async (firebaseUser) => {
  user.value = firebaseUser;
  if (!firebaseUser) {
    regimentStore.hasRegiment = false; // Reset if user logs out
    return;
  }

  try {
    const docRef = doc(db, "regiment", firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    regimentStore.hasRegiment = !!docSnap.data();
  } catch (error) {
    console.error("Error fetching regiment data:", error);
  }
});

const signin = async () => {
  loginError.value = ''
  if (!email.value || !password.value) {
    loginError.value = 'Email and password are required'
    return
  }

  if (!email.value.includes('@')) {
    loginError.value = 'Invalid email'
    return
  }

  loginLoading.value = true
  const recaptchaResult = await recaptcha('login')

  if (!recaptchaResult) {
    loginError.value = 'Recaptcha failed'
    loginLoading.value = false
    return
  }

  loginError.value = ''

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      const user = auth?.currentUser;

      if (!user) {
        loginError.value = "Invalid email or password";
        loginLoading.value = false;
        return;
      }

      if (!user.emailVerified) {
        loginError.value = "Email not verified";
        signOut(auth);
        loginLoading.value = false;
        return;
      }

      drawerVisible.value = false;
      userDrawerVisible.value = true;
      loginError.value = "";
      loginLoading.value = false;

      regimentStore.getRegiments(true);
    })
    .catch(() => {
      loginError.value = 'Invalid email or password'
      loginLoading.value = false
    })
}

const recaptcha = async (action: string): Promise<boolean> => {
  await recaptchaLoaded()

  const token = await executeRecaptcha('login')

  const response = await fetch(import.meta.env.VITE_RECAPTCHA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: {
        token: token,
        expectedAction: action,
        siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      },
    }),
  })

  const data = await response.json()

  if (!data) {
    return false
  }

  return !(!data.riskAnalysis || data.riskAnalysis.score < 0.5)
}

const googleAuthProvider = new GoogleAuthProvider()
const error = ref(null)
const signinPopup = () => {
  error.value = null
  signInWithPopup(auth, googleAuthProvider)
    .catch((reason) => {
      error.value = reason
    })
    .finally(async () => {
      drawerVisible.value = false
      userDrawerVisible.value = true
      error.value = null
      regimentStore.userRegiment = await regimentStore.getUserRegiment() ?? null
    })
}

const logout = () => {
  drawerVisible.value = false
  userDrawerVisible.value = false
  signOut(auth)
}

const searchStore = useSearchStore()
const drawerVisible = ref(false)
const userDrawerVisible = ref(false)
</script>

<style scoped>
.header-card-top {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  min-width: 260px;
}

.header-card-bottom {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  min-width: 260px;
  background: var(--p-surface-800);
}

.slogan {
  font-size: 1.7rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .slogan {
    font-size: 1.5rem;
  }

  .header-card-bottom {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .header-card-top {
    padding-top: 3rem;
  }
}

.foxhole {
  margin-top: -0.2rem;
  margin-left: 1px;
}
.collie {
  color: #4ade80;
}
.warden {
  color: #38bdf8;
}

.gsi-material-button {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -webkit-appearance: none;
  background-color: #131314;
  background-image: none;
  -webkit-border-radius: 6px;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #e3e3e3;
  cursor: pointer;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 14px;
  height: 40px;
  letter-spacing: 0.25px;
  outline: none;
  overflow: hidden;
  padding: 0 12px;
  position: relative;
  text-align: center;
  -webkit-transition:
    background-color 0.218s,
    border-color 0.218s,
    box-shadow 0.218s;
  transition:
    background-color 0.218s,
    border-color 0.218s,
    box-shadow 0.218s;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
  max-width: 100%;
  min-width: min-content;
  border-color: #8e918f;
  min-height: 43px;
}

.gsi-material-button .gsi-material-button-icon {
  height: 20px;
  margin-right: 12px;
  min-width: 20px;
  width: 20px;
}

.gsi-material-button .gsi-material-button-content-wrapper {
  -webkit-align-items: center;
  align-items: center;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.gsi-material-button .gsi-material-button-contents {
  -webkit-flex-grow: 1;
  flex-grow: 1;
  font-family: 'Roboto', arial, sans-serif;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
}

.gsi-material-button .gsi-material-button-state {
  -webkit-transition: opacity 0.218s;
  transition: opacity 0.218s;
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.gsi-material-button:disabled {
  cursor: default;
  background-color: #13131461;
  border-color: #8e918f1f;
}

.gsi-material-button:disabled .gsi-material-button-state {
  background-color: #e3e3e31f;
}

.gsi-material-button:disabled .gsi-material-button-contents {
  opacity: 38%;
}

.gsi-material-button:disabled .gsi-material-button-icon {
  opacity: 38%;
}

.gsi-material-button:not(:disabled):active .gsi-material-button-state,
.gsi-material-button:not(:disabled):focus .gsi-material-button-state {
  background-color: white;
  opacity: 12%;
}

.gsi-material-button:not(:disabled):hover {
  -webkit-box-shadow:
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
  box-shadow:
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.gsi-material-button:not(:disabled):hover .gsi-material-button-state {
  background-color: white;
  opacity: 8%;
}
</style>
