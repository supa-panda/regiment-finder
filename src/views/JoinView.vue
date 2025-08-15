<template>
  <Dialog
    v-if="regimentStore.regimentsLoaded && regimentStore.dialogRegiment"
    v-model:visible="regimentStore.showRegimentDialog"
    dismissable-mask
    :draggable="false"
    modal
    :baseZIndex="10000"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="redirectToIndex"
  >
    <template #header>
      <div class="flex items-center gap-4">
        <div class="flex flex-col lg:flex-row gap-2">
          <h2 class="text-xl">{{ regimentStore.dialogRegiment.name }}</h2>
            <span class="text-sm text-zinc-100 gap-2 flex flex-wrap">
              <div>
                <Tag>{{ regimentStore.dialogRegiment.clantag }}</Tag>
              </div>
              <div>
                <a :href="regimentStore.dialogRegiment.discord" target="_blank" class="w-full">
                  <Tag
                    severity="info"
                    icon="pi pi-discord"
                  >
                    Join discord
                  </Tag>
                </a>
              </div>
            </span>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <img
        v-if="regimentStore.dialogRegiment.image"
        class="regiment-image rounded-lg"
        alt="user header"
        :src="regimentStore.dialogRegiment.image"
        @error="errorImg"
      />
      <p>Faction</p>
      <div>
        <Tag :severity="regimentStore.dialogRegiment.faction === 0 ? 'success' : 'info'">
          {{ regimentStore.dialogRegiment.faction === 0 ? 'Colonial' : 'Warden' }}
        </Tag>
      </div>

      <br v-if="regimentStore.dialogRegiment.long_desc" />
      <p v-if="regimentStore.dialogRegiment.long_desc">About us:</p>
      <span
        v-if="regimentStore.dialogRegiment.long_desc"
        v-html="regimentStore.dialogRegiment.long_desc"
        class="break-words"
      ></span>

      <br />
      <p>Activities:</p>
      <div class="flex gap-2 flex-wrap">
        <Tag
          v-for="activity in regimentStore.dialogRegiment.activities"
          :severity="activity === 'hardcore' ? 'danger' : (regimentStore.dialogRegiment.faction === 0 ? 'success' : 'info')"
          :key="activity"
        >
            <span v-if="activity === 'hardcore'">
              💀
            </span>
          {{ capitalize(activity) }}
        </Tag>
      </div>

      <br v-if="regimentStore.dialogRegiment.languages.length !== 0" />
      <p v-if="regimentStore.dialogRegiment.languages.length !== 0">Languages</p>
      <div class="flex gap-2 flex-wrap" v-if="regimentStore.dialogRegiment.languages.length !== 0">
        <Tag
          severity="warn"
          v-for="language in regimentStore.dialogRegiment.languages"
          :key="language.value"
          placeholder="Top"
        >
          {{ language.name }}
        </Tag>
      </div>

      <br v-if="regimentStore.dialogRegiment.timezones.length !== 0" />
      <p v-if="regimentStore.dialogRegiment.timezones.length !== 0">Timezones</p>
      <div class="flex gap-2 flex-wrap" v-if="regimentStore.dialogRegiment.timezones.length !== 0">
        <Tag
          severity="secondary"
          v-for="timezone in regimentStore.dialogRegiment.timezones"
          :key="timezone"
          placeholder="Top"
        >
          🕙 {{ capitalize(timezone) }}
        </Tag>
      </div>

      <br />
      <div class="flex justify-between items-center gap-2">
        <Tag v-if="regimentStore.dialogRegiment.established.seconds">
          Established {{ moment.unix(regimentStore.dialogRegiment.established.seconds).fromNow() }}
        </Tag>
        <Tag>
          <i class="pi pi-user"></i>
          {{ abbreviatePlayerCount(regimentStore.dialogRegiment.players) }} Active players
        </Tag>
      </div>

      <a :href="regimentStore.dialogRegiment.discord" target="_blank" class="w-full">
        <Button
          label="Discord"
          class="w-full"
          :severity="regimentStore.dialogRegiment.faction === 0 ? 'success' : 'info'"
          icon="pi pi-discord"
        />
      </a>
    </div>
  </Dialog>

  <div
    v-if="loading"
    class="flex flex-col items-center justify-center gap-4 pb-10"
  >
    <ProgressSpinner />
  </div>

  <div
    v-if="regimentNotFound"
    class="flex flex-col items-center justify-start gap-4"
  >
    <img src="@/assets/empty.svg" alt="No regiments found" class="w-1/2 max-h-100 max-w-[10rem]" />
    <span class="text-center text-xl text-zinc-100">Sorry, we looked hard but such regiment doesn't exist...</span>
    <router-link to="/" >
      <Button
        label="Go to homepage"
        class="w-full p-button-secondary"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRegimentStore } from '@/stores/regiment.ts'

import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { Regiment } from '@/views/IndexView.vue'
import moment from 'moment/moment'
import colonialImg from '@/assets/collie-bg.png'
import wardenImg from '@/assets/warden-bg.png'

const regimentStore = useRegimentStore()
const route = useRoute()
const router = useRouter()
const clantag = route.params.clantag as string
const regimentNotFound = ref(false);
const loading = ref(true);

const abbreviatePlayerCount = (playerCount: string) => {
  const num = parseInt(playerCount)
  return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num
}

const capitalize = (activity: string) => {
  return activity.charAt(0).toUpperCase() + activity.slice(1)
}

function errorImg(e: any) {
  e.target.src = regimentStore.dialogRegiment.faction === 0 ? colonialImg : wardenImg
}

onMounted(async () => {
  const regiments = await regimentStore.getRegiments()

  regimentStore.dialogRegiment = regiments.find(
    (regiment: Regiment) => regiment.shortlink?.toLowerCase() === clantag.toLowerCase(),
  )
  loading.value = false

  if (!regimentStore.dialogRegiment) {
    regimentNotFound.value = true;
    return
  }

  regimentStore.showRegimentDialog = true
})

const redirectToIndex = () => {
  regimentStore.showRegimentDialog = false
  regimentStore.dialogRegiment = null
  router.push({ name: 'index' })
}

</script>

<style scoped>
.stickyButton {
  background: var(--p-surface-900);
}
</style>