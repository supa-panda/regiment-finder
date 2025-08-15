<template>
  <Card style="overflow: hidden" :class="
    ((props.regiment.premium && regimentPremiumValid()) || props.premiumPreview)
    ? ('premium template ' + 'template-' + props.regiment.template + ' border-' + props.regiment.border)
    : ''">
    <template #header>
      <div class="relative">
        <div class="absolute right-2 top-2">
          <Tag v-if="props.regiment.premium && regimentPremiumValid()" :severity="props.regiment.faction === 0 ? 'success' : 'info'" class="rounded-xl supporter">
            <i class="pi pi-icon pi-heart-fill py-1" />Supporter
          </Tag>
        </div>
        <img
          v-if="!imageLoading && image.src"
          class="regiment-image"
          alt="user header"
          :src="image.src"
          @error="errorImg"
        />
      </div>
      <div v-if="imageLoading" class="relative">
        <img
          class="regiment-image"
          alt="user header"
          :src="props.regiment.faction === 0 ? colonialImg : wardenImg"
        />
        <div
          v-if="props.regiment.image"
          class="absolute w-full h-full top-0 left-0 backdrop-blur-sm flex items-center justify-center"
        >
          <ProgressSpinner />
        </div>
        <div class="absolute inset-0 flex items-center justify-center"></div>
      </div>
    </template>
    <template #title>
      <div class="flex items-center gap-2">
        <span class="title">
          {{ props.regiment.name }}
        </span>
        <Tag v-if="props.regiment.clantag">{{ props.regiment.clantag }}</Tag>
      </div>
    </template>
    <template #subtitle><span class="slogan">{{ props.regiment.slogan }}</span></template>
    <template #content>
      <div class="flex flex-col gap-2 h-full grow flex-1">
        <p class="m-0">
          {{ truncate(props.regiment.short_desc, 200) }}
          <Button
            v-if="props.regiment.short_desc && props.regiment.short_desc.length > 200"
            @click="openDialog"
            size="small"
            label="Read more"
            class="p-button-text"
          />
        </p>
        <div class="flex gap-2 flex-wrap">
          <Tag
            severity="success"
            style="background: linear-gradient(45deg, #4ade80, #38bdf8); color: white"
            v-if="props.regiment.faction == 2"
          >
            Neutral faction
          </Tag>
          <Tag
            v-for="activity in props.regiment.activities"
            :key="activity"
            :severity="activity === 'hardcore' ? 'danger' : (props.regiment.faction === 0 ? 'success' : 'info')"
            class="flex items-center"
          >
            <span v-if="activity === 'hardcore'">
              💀
            </span>
            {{ capitalize(activity) }}
          </Tag>
          <Tag
            v-if="props.regiment.languages"
            severity="warn"
            v-for="language in props.regiment.languages"
            :key="language.value"
            v-tooltip.top="'Language'"
            placeholder="Top"
            v-html="displayLanguageTag(language.value)"
          >
          </Tag>
          <Tag
            v-if="props.regiment.timezones"
            severity="secondary"
            v-for="timezone in props.regiment.timezones"
            :key="timezone"
            v-tooltip.top="'Timezone'"
            placeholder="Top"
          >
            🕙 {{ capitalize(timezone) }}
          </Tag>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center gap-2">
          <Tag v-if="props.regiment.established && props.regiment.established.seconds">
            Established {{ moment.unix(props.regiment.established.seconds).fromNow() }}
          </Tag>

          <Tag v-tooltip.top="'Active players'" placeholder="Top">
            <i class="pi pi-user"></i> {{ abbreviatePlayerCount(props.regiment.players) }}
          </Tag>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
          <Button
            @click="openDialog"
            label="Details"
            class="w-full"
            severity="secondary"
            icon="pi pi-info-circle"
          />
          <a :href="props.regiment.discord" target="_blank" class="w-full">
            <Button
              label="Discord"
              @click="upvoteRegiment"
              class="w-full"
              :severity="props.regiment.faction === 0 ? 'success' : 'info'"
              icon="pi pi-discord"
            />
          </a>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue'
import { useRegimentStore } from '@/stores/regiment.ts'
import moment from 'moment'
import wardenImg from '@/assets/warden-bg.png'
import colonialImg from '@/assets/collie-bg.png'
import { languageList } from '@/helpers/languages.ts'

const regimentStore = useRegimentStore()
const imageLoading = ref(true)
const image = ref()
const loadImage = () => {
  image.value = new Image()
  image.value.src = props.regiment.image
  image.value.onload = () => {
    imageLoading.value = false
  }
  image.value.onerror = () => {
    imageLoading.value = false
  }
  image.value.onabort = () => {
    imageLoading.value = false
  }
}

onMounted(() => {
  loadImage()
})

const upvoteRegiment = () => {
  try {
    regimentStore.upvoteRegiment(props.regiment.id)
  } catch (e) {
    console.error(e)
  }
}

const openDialog = () => {
  regimentStore.dialogRegiment = props.regiment
  regimentStore.showRegimentDialog = true
  upvoteRegiment()
}

const props = defineProps<{
  regiment: {
    id: string
    name: string
    slogan: string
    faction: number
    languages: Array<{ name: string; value: string }>
    timezones: Array<string>
    players: string
    activities: Array<string>
    long_desc: string
    short_desc: string
    image: string
    discord: string
    established: { seconds: number }
    clantag: string
    updated: { seconds: number }
    premium: boolean
    template: number
    border: number
    active_until: string | undefined
  },
  premiumPreview?: boolean
}>()

const regimentPremiumValid = () => {
  if (props.regiment.premium && props.regiment.active_until) {
    return (new Date(props.regiment.active_until) > new Date());
  }

  return false
}

function errorImg(e: any) {
  e.target.src = props.regiment.faction === 0 ? colonialImg : wardenImg
}

const capitalize = (activity: string) => {
  return activity.charAt(0).toUpperCase() + activity.slice(1)
}

const truncate = (text: string, length: number) => {
  if (!text) return text
  return text.length > length ? text.slice(0, length) + '...' : text
}

const abbreviatePlayerCount = (playerCount: string) => {
  const num = parseInt(playerCount)
  return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num
}

const displayLanguageTag = (lang: string) => {
  const language = languageList.find((l) => l.value === lang)
  return language
    ? '<span class="flag-icon flag-icon-' + language.flag + '"></span> ' + language.name
    : capitalize(lang)
}
</script>

<style>
.regiment-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.p-card-body,
.p-card-content {
  height: 100%;
}

.premium {
  z-index: 1;
}

.premium.template-0 .p-card-body::before {
  background: url('@/assets/images/template-0.jpg') no-repeat;
}

.premium.template-1 .p-card-body::before {
  background: url('@/assets/images/template-1.jpg') no-repeat;
}

.premium.template-2 .p-card-body::before {
  background: url('@/assets/images/template-2.jpeg') no-repeat;
}

.premium.template-3 .p-card-body::before {
  background: url('@/assets/images/template-3.jpg') no-repeat;
}

.premium.template-4 .p-card-body::before {
  background: url('@/assets/images/template-4.jpg') no-repeat;
}

.premium.template-5 .p-card-body::before {
  background: url('@/assets/images/template-5.jpg') no-repeat;
}

.premium.template-6 .p-card-body::before {
  background: url('@/assets/images/template-6.jpg') no-repeat;
}

.premium.template-7 .p-card-body::before {
  background: url('@/assets/images/template-7.jpg') no-repeat;
}

.premium.template-8 .p-card-body::before {
  background: url('@/assets/images/template-8.jpg') no-repeat;
}

.premium.template-9 .p-card-body::before {
  background: url('@/assets/images/template-9.jpg') no-repeat;
}

.premium.template-10 .p-card-body::before {
  background: url('@/assets/images/template-10.jpg') no-repeat;
}

.premium.template-11 .p-card-body::before {
  background: url('@/assets/images/camo-collie.jpg') no-repeat;
}

.premium.template-12 .p-card-body::before {
  background: url('@/assets/images/camo-warden.jpg') no-repeat;
}

.premium.template-13 .p-card-body::before {
  background: url('@/assets/images/template-13.jpg') no-repeat;
}

.premium.template-14 .p-card-body::before {
  background: url('@/assets/images/template-14.jpg') no-repeat;
}

.premium.template-15 .p-card-body::before {
  background: url('@/assets/images/template-15.webp') no-repeat;
}

.premium.template-16 .p-card-body::before {
  background: url('@/assets/images/template-16.jpg') no-repeat;
}

.premium.template-17 .p-card-body::before {
  background: url('@/assets/images/template-17.jpg') no-repeat;
}

.premium.template-18 .p-card-body::before {
  background: url('@/assets/images/template-18.gif') no-repeat;
}

.premium.template-19 .p-card-body::before {
  background: url('@/assets/images/template-19.gif') no-repeat;
}

.premium.template-20 .p-card-body::before {
  background: url('@/assets/images/template-20.gif') no-repeat;
}

.premium.template-21 .p-card-body::before {
  background: url('@/assets/images/template-w.png') no-repeat;
}
.premium.template-22 .p-card-body::before {
  background: url('@/assets/images/template-c.jpg') no-repeat;
}



.premium.template .p-card-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(10px);
  z-index: -1;
  transition: filter 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 6px;
}

.premium.template:hover .p-card-body::before {
  filter: blur(5px);
}

.premium.template .p-card-body {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.premium.template.template--1 .p-card-body {
  background: transparent !important;
}

.premium.template .slogan {
  color: white;
  font-weight: 500;
}

.premium.template .title {
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
}

@property --bg-angle {
  inherits: false;
  initial-value: 0deg;
  syntax: "<angle>";
}

@keyframes spin {
  to {
    --bg-angle: 360deg;
  }
}

.premium.border-0 {
  animation: spin 2.5s infinite linear running;
  background:
    linear-gradient(
      to bottom,
      oklch(0.1 0.2 240 / 0.95),
      oklch(0.1 0.2 240 / 0.95)
    )
    padding-box,
    conic-gradient(
      from var(--bg-angle) in oklch longer hue,
      oklch(0.85 0.37 0) 0 0
    )
    border-box !important;
  border: 6px solid transparent;
}

.premium.border-1 {
  background: url(@/assets/images/usa.webp) no-repeat center;
  background-size: cover;
  padding: 10px;
  border: none;
}

.premium.border-1 .p-card-body {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.premium.border-1 .p-card-header {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.premium.border-1 .p-card-header .regiment-image {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.premium.border-2 {
  border: 6px solid #fff;
}

.premium.border-3 {
  border: 6px solid #38bdf8;
}

.premium.border-4 {
  border: 6px solid #4ade80;
}

.premium.border-5 {
  background: url(@/assets/images/camo-warden.jpg);
  background-size: cover;
  border: none;
  padding: 10px;
}

.premium.border-5 .p-card-body {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.premium.border-5 .p-card-header {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.premium.border-5 .p-card-header .regiment-image {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.premium.border-6 {
  background: url(@/assets/images/camo-collie.jpg);
  background-size: cover;
  border: none;
  padding: 10px;
}

.premium.border-6 .p-card-body {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.premium.border-6 .p-card-header {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.premium.border-6 .p-card-header .regiment-image {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.premium.border-7 {
  box-shadow: 0 0 50px 15px #d71ebc;
}

.premium.border-8 {
  box-shadow: 0 0 50px 15px #38bdf8;
}

.premium.border-9 {
  box-shadow: 0 0 50px 15px #4ade80;
}

.premium.border-10 {
  background: url(@/assets/images/russia.svg);
  background-size: cover;
  border: none;
  padding: 10px;
}

.premium.border-11 {
  background: url(@/assets/images/germany.svg.webp);
  background-size: cover;
  border: none;
  padding: 10px;
}

.supporter {
  opacity: 1 !important;
}


</style>
