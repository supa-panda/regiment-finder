import { type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { getStorage, ref as fireRef, uploadString, getDownloadURL } from 'firebase/storage'
import { collection, doc, getDoc, getDocs, updateDoc, setDoc, query, where } from 'firebase/firestore'
import { getCurrentUser } from 'vuefire'

export const useRegimentStore = defineStore('regiment', () => {
  const hasRegiment = ref(false)
  const userRegiment = ref()
  const showRegimentDialog = ref(false)
  const dialogRegiment = ref()
  const regiments = ref()
  const regimentsLoaded = ref(false)
  const upvotes: Ref<Map<string, number> | undefined> = ref()
  const upvotesLoaded = ref(false)
  const displayGrid = ref(true)

  const savePremium = async (regimentId: string, border: number, template: number) => {
    const regimentRef = doc(db, 'regiment', regimentId)
    await updateDoc(regimentRef, { border, template })
    await getRegiments(true)
  }

  const upvoteRegiment = async (regimentId: string) => {
    const upvoteCollection = collection(db, 'upvotes')
    const upvoteDoc = doc(upvoteCollection, regimentId)
    const upvoteDocSnap = await getDoc(upvoteDoc)
    if (upvoteDocSnap.exists()) {
      await updateDoc(upvoteDoc, { count: upvoteDocSnap.data()?.count + 1 })
    } else {
      await setDoc(upvoteDoc, { count: 1 })
    }

    // @ts-expect-error TODO: fix this
    upvotes.value.set(regimentId, (upvotes.value?.get(regimentId) ?? 0) + 1)
    // @ts-expect-error TODO: fix this
    localStorage.setItem('upvotes', JSON.stringify(Array.from(upvotes.value.entries())))
  }

  const uploadImageAndGetUrl = async (file: string) => {
    const storage = getStorage()
    const storageRef = fireRef(storage, `images/${uuidv4()}`)
    const snapshot = await uploadString(storageRef, file, 'data_url')

    return await getDownloadURL(snapshot.ref)
  }

  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const getRegiments = async (force: boolean = false) => {
    if (!regimentsLoaded.value && !force) {
      fetchLocal()
    }

    await getUpvotes()

    if (!regiments.value || force) {
      await fetchRegiments()
      regimentsLoaded.value = true

      if (!force) await storeToLocal()

      return regiments.value
    }

    regimentsLoaded.value = true
    return regiments.value
  }

  const fetchUpvotes = async () => {
    const upvoteCollection = collection(db, 'upvotes')
    const snapshot = await getDocs(upvoteCollection)
    const upvotesMap = new Map()

    snapshot.docs.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id }
      const id = data.id
      // @ts-expect-error TODO: fix this
      upvotesMap.set(id, data.count)
    })

    localStorage.setItem('upvotes', JSON.stringify(Array.from(upvotesMap.entries())))
    localStorage.setItem('upvotesCacheDate', new Date().getTime().toString())
    upvotesLoaded.value = true
    return upvotes
  }

  const getUpvotes = async () => {
    if (!upvotes.value) {
      const cacheTime = localStorage.getItem('upvotesCacheDate')

      if (!cacheTime) {
        await fetchUpvotes()
      } else {
        const now = new Date().getTime()
        const diff = now - parseInt(cacheTime)

        if (Math.abs(diff) > 1000 * 60) {
          await fetchUpvotes()
        } else {
          upvotes.value = new Map(JSON.parse(localStorage.getItem('upvotes') ?? '[]'))
        }
      }
    }

    if (!upvotes.value) {
      await fetchUpvotes()
    }

    upvotesLoaded.value = true
    return upvotes.value
  }

  const storeToLocal = async () => {
    localStorage.setItem('regiments', JSON.stringify(await getRegiments()))
    localStorage.setItem('cacheDate', new Date().getTime().toString())
  }

  const refreshLocalStorage = async () => {
    regiments.value = await getRegiments(true)
    localStorage.setItem('regiments', JSON.stringify(regiments.value))
    localStorage.setItem('cacheDate', new Date().getTime().toString())
  }

  const fetchLocal = () => {
    const cacheDate = localStorage.getItem('cacheDate')
    if (!cacheDate) {
      return
    }
    const now = new Date().getTime()
    const diff = now - parseInt(cacheDate)
    if (Math.abs(diff) > 1000 * 60 * 60) {
      return
    }
    regiments.value = JSON.parse(localStorage.getItem('regiments') ?? '[]')
    regimentsLoaded.value = true
  }

  const fetchRegiments = async () => {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const regimentCollection = collection(db, 'regiment')
    const regimentQuery = query(
      regimentCollection,
      where('updated', '>=', sixtyDaysAgo),
    )
    const snapshot = await getDocs(regimentQuery)

    regiments.value = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id }
    })
  }

  if (!userRegiment.value) {
    getUserRegiment().then((regiment) => {
      if (regiment) {
        userRegiment.value = regiment
        userRegiment.value.id = regiment.id
        hasRegiment.value = true
      }
    })
  }

  return {
    regiments,
    hasRegiment,
    userRegiment,
    showRegimentDialog,
    dialogRegiment,
    getRegiments,
    regimentsLoaded,
    refreshLocalStorage,
    uploadImageAndGetUrl,
    getUpvotes,
    upvotes,
    upvotesLoaded,
    upvoteRegiment,
    savePremium,
    getUserRegiment,
    displayGrid
  }
})

const getUserRegiment = async () => {
  const user = await getCurrentUser()
  if (!user) {
    return
  }
  const docRef = doc(db, 'regiment', user?.uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.data()) {
    return { ...docSnap.data(), id: docSnap.id }
  }
  return
}
