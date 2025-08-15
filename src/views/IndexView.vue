<template>
  <Dialog
    v-model:visible="regimentStore.showRegimentDialog"
    dismissable-mask
    :draggable="false"
    modal
    :baseZIndex="10000"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
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
          {{ faction.value === 0 ? 'Colonial' : 'Warden' }}
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

  <div class="flex items-center justify-center flex-col p-4 gap-4">
    <News />
    <div class="w-full filters">
      <Card>
        <template #content>
          <div
            :class="
              filtersVisible
                ? 'flex justify-between items-center flex-wrap sm:flex-nowrap gap-2'
                : 'justify-between items-center flex-wrap gap-2 max-h-11 overflow-hidden'
            "
          >
            <div class="flex items-center gap-2 flex-wrap">
              <div class="flex justify-between items-center w-full sm:w-auto">
                <SelectButton
                  v-model="faction"
                  :options="factions"
                  option-label="name"
                  :allow-empty="false"
                  :class="faction.value === 0 ? 'colonial' : 'warden'"
                >
                  <template #option="slotProps">
                    {{ slotProps.option.name }}
                  </template>
                </SelectButton>
                <div class="block sm:hidden">
                  <Button
                    @click="filtersVisible = !filtersVisible"
                    icon="pi pi-filter"
                    class="p-button-text"
                    :label="filtersVisible ? 'Hide' : 'Show'"
                  />
                </div>
              </div>

              <Select
                v-model="shard"
                :options="shards"
                optionLabel="name"
                placeholder="Shard"
                class="w-full sm:w-auto"
              />
              <Select
                v-model="size"
                :options="sizes"
                optionLabel="name"
                placeholder="Regiment size"
                :showClear="true"
                class="w-full sm:w-auto"
              />
              <MultiSelect
                v-model="activity"
                :options="activities"
                optionLabel="name"
                placeholder="Specialization"
                display="chip"
                :showToggleAll="false"
                class="w-full sm:w-auto sm:max-w-120 sm:min-w-45"
                show-clear
              >
                <template #option="item">
                  <Tag severity="danger" v-if="item.option.value === 'hardcore'">{{ item.option.name }}</Tag>
                  <span v-else>{{ item.option.name }}</span>
                </template>
              </MultiSelect>
              <MultiSelect
                v-model="timezone"
                :options="timezones"
                optionLabel="name"
                placeholder="Region"
                display="chip"
                :showToggleAll="false"
                class="w-full sm:w-auto sm:max-w-120 sm:min-w-45"
                show-clear
              />
              <MultiSelect
                v-model="language"
                :options="languages"
                optionLabel="name"
                placeholder="Language"
                display="chip"
                :showToggleAll="false"
                filter
                auto-filter-focus
                show-clear
                class="w-full sm:w-auto sm:max-w-120 sm:min-w-45"
                :maxSelectedLabels="5"
              >
                <template #option="item">
                  <span :class="'flag-icon flag-icon-' + item.option.flag"></span> {{item.option.name }}
                </template>
              </MultiSelect>
            </div>
            <div class="flex justify-between items-center w-full gap-2 sm:w-auto">
              <Select
                v-model="sort"
                :options="sorts"
                optionLabel="name"
                placeholder="Regiment size"
                class="w-full md:w-56"
              />
              <SelectButton
                :options="
                  [
                    { name: 'Grid', value: true },
                    { name: 'List', value: false },
                  ]
                "
                v-model="displayGrid"
                optionLabel="name"
                class="min-h-10 sm:w-auto"
                >
                <template #option="slotProps">
                  <i
                    :class="`pi pi-${slotProps.option.value ? 'th-large' : 'list'}`"
                    class="mr-2"
                  />
                </template>
              </SelectButton>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div
      v-if="!regimentStore.regimentsLoaded"
      class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full"
    >
      <Skeleton class="w-full" height="500px" v-for="i in 8" :key="i" />
    </div>
      <div v-if="regimentStore.displayGrid" class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <RegimentCard v-for="regiment in paginatedRegiments" :key="regiment" :regiment="regiment" />
      </div>
      <div v-else class="flex flex-col gap-4 w-full">
        <RegimentCardHorizontal v-for="regiment in paginatedRegiments" :key="regiment" :regiment="regiment" />
      </div>
    <div
      v-if="regimentsFiltered.length === 0"
      class="flex flex-col items-center justify-center gap-4 min-h-100"
    >
      <img src="@/assets/empty.svg" alt="No regiments found" class="w-1/2 max-h-100" />
      <span class="text-center text-xl text-zinc-100">No regiments found</span>
    </div>
    <div v-else class="pt-4">
      <Paginator
        v-model:first="pagination.first"
        :rows="pagination.rows"
        :totalRecords="regimentsFiltered.length"
        :rowsPerPageOptions="[10, 20, 40]"
        @update:rows="val => pagination.rows = val"
        @page="scrollToTop"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import RegimentCard from '@/components/RegimentCard.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { useSearchStore } from '@/stores/search.ts'
import { useRegimentStore } from '@/stores/regiment.ts'
import wardenImg from '@/assets/warden-bg.png'
import colonialImg from '@/assets/collie-bg.png'
import { languageList } from '@/helpers/languages.ts'
import News from '@/components/News.vue'
import RegimentCardHorizontal from '@/components/RegimentCardHorizontal.vue'
import type { Regiment } from '@/types/Regiment.ts'

const regimentStore = useRegimentStore()
const ifMobile = window.innerWidth < 768
const filtersVisible = ref(!ifMobile)
const displayGrid = ref({
  name: 'Grid',
  value: true,
})

watch(displayGrid, (value) => {
  regimentStore.displayGrid = value.value
})

const scrollToTop = () => {
  const element = document.querySelector('.filters') as HTMLElement
  if (element) {
    element.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}

const abbreviatePlayerCount = (playerCount: string) => {
  const num = parseInt(playerCount)
  return num > 1000 ? `${(num / 1000).toFixed(1)}k` : num
}

function errorImg(e: any) {
  e.target.src = regimentStore.dialogRegiment.faction === 0 ? colonialImg : wardenImg
}

const pagination = reactive({
  first: 0,
  rows: 10,
})

const searchStore = useSearchStore()

const selected = Math.floor(Math.random() * 2)

const factions = ref([
  { name: 'Colonial', value: 0 },
  { name: 'Warden', value: 1 },
])
const faction = ref(factions.value[selected])

const shard = ref({ name: 'Able', value: 'able' })
const shards = ref([
  { name: 'Able', value: 'able' },
  { name: 'Baker', value: 'baker' },
  { name: 'Charlie', value: 'charlie' },
])

const size = ref(null)
const sizes = ref([
  { name: 'Small (less than 20 players)', value: 'small' },
  { name: 'Medium (less than 100 players)', value: 'medium' },
  { name: 'Large (more than 100 players)', value: 'large' },
])

const sort = ref({
  name: 'Sort by popularity',
  value: 'popular',
})
const sorts = ref([
  { name: 'Sort by popularity', value: 'popular' },
  { name: 'Newest first', value: 'newest' },
  { name: 'Oldest first', value: 'oldest' },
  { name: 'Most players first', value: 'most-players' },
  { name: 'Least players first', value: 'least-players' },
])

const activity = ref(null)
const activities = ref([
  { name: 'Airborne', value: 'airborne' },
  { name: 'Artillery', value: 'artillery' },
  { name: 'Facilities', value: 'facilities' },
  { name: 'Infantry', value: 'infantry' },
  { name: 'Logistics', value: 'logistics' },
  { name: 'Naval', value: 'naval' },
  { name: 'Partisan', value: 'partisan' },
  { name: 'Tanks', value: 'tanks' },
  { name: 'Engineering', value: 'engineering' },
  { name: '💀 Hardcore', value: 'hardcore' },
])

const timezone = ref(null)
const timezones = ref([
  { name: '🌐 Global', value: 'global' },
  { name: 'North America', value: 'america' },
  { name: 'South America', value: 'southamerica' },
  { name: 'Middle East', value: 'middle-east' },
  { name: 'Europe', value: 'europe' },
  { name: 'Africa', value: 'africa' },
  { name: 'Asia', value: 'asia' },
  { name: 'Oceania', value: 'oceania' },
])

const language = ref(null)
const languages = ref(languageList)

const filters = computed(() => {
  const arrayFromValues = (values: any) => {
    return values ? values.map((value: any) => value.value) : []
  }
  return {
    faction: faction.value.value,
    shard: shard.value.value,
    size: size.value,
    sort: sort.value.value,
    activities: arrayFromValues(activity.value),
    term: searchStore.term,
    page: pagination.first,
    timezones: arrayFromValues(timezone.value),
    languages: arrayFromValues(language.value),
  }
})

const regimentsFiltered = ref([])

watch(filters, async () => {
  regimentsFiltered.value = await getRegimentsFiltered()
})

onMounted(async () => {
  regimentsFiltered.value = await getRegimentsFiltered()
})

const paginatedRegiments = computed(() => {
  const start = pagination.first;
  const end = start + pagination.rows;
  return regimentsFiltered.value.slice(start, end);
});

const getRegimentsFiltered = async () => {
  const regiments = await regimentStore.getRegiments()
  if (!regiments) {
    return []
  }

  const regimentPremiumValid = (regiment: Regiment) => {
    if (regiment.premium && regiment.active_until) {
      return (new Date(regiment.active_until) > new Date());
    }

    return false
  }

  const filteredRegiments = regiments.filter((regiment: any) => {
    let filtered =
      filters.value.shard &&
      regiment.shard.includes(filters.value.shard) &&
      (filters.value.timezones === null ||
        (regiment.timezones && regiment.timezones.includes('global')) ||
        regiment.timezones.filter((timezone: any) => filters.value.timezones.includes(timezone))
          .length >
          filters.value.timezones.length - 1) &&
      (filters.value.languages === null ||
        (regiment.languages &&
          regiment.languages.filter((language: any) =>
            filters.value.languages.includes(language.value),
          ).length >
            filters.value.languages.length - 1)) &&
      ((filters.value.faction === regiment.faction) || regiment.faction == 2) &&
      (filters.value.term === '' ||
        regiment.name.toLowerCase().includes(filters.value.term.toLowerCase()) ||
        regiment.clantag.toLowerCase().includes(filters.value.term.toLowerCase())) &&
      (filters.value.activities === null ||
        regiment.activities.filter((activity: any) => filters.value.activities.includes(activity))
          .length >
          filters.value.activities.length - 1)

    if (filters.value.size !== null) {
      // @ts-expect-error Todo: Fix this
      switch (filters.value.size.value) {
        case 'small':
          filtered = filtered && regiment.players < 20
          break
        case 'medium':
          filtered = filtered && regiment.players >= 20 && regiment.players < 100
          break
        case 'large':
          filtered = filtered && regiment.players >= 100
          break
      }
    }

    return filtered
  })
  let sortedAndFilteredRegiments = filteredRegiments

  if (filters.value.sort) {
    switch (filters.value.sort) {
      case 'popular':
        const upvotes: Map<string, number> | undefined = await regimentStore.getUpvotes()

        const maxUpvoteValue = upvotes ? Math.max(...Array.from(upvotes.values())) : 0

        const maxPlayerValue = Math.max(
          ...filteredRegiments.map((regiment: any) => regiment.players),
        )

        const normalize = (val: number, min: number, max: number, scale: number = 1) => {
          if (max === min) return 0
          return ((val - min) / (max - min)) * scale
        }

        const rating = (regiment: any) => {
          let rating = 0
          if (regiment.image && regiment.image !== '') rating += 5
          if (regiment.premium && regimentPremiumValid(regiment)) rating += 1
          if (regiment.short_desc) rating++
          if (regiment.long_desc) rating++
          if (regiment.slogan) rating++
          if (regiment.activities.length > 3) rating--
          if (regiment.activities.length === 1) rating += 0.5
          if (regiment.activities.length > 5) rating--

          rating += normalize(regiment.players, 0, maxPlayerValue, 1)
          rating += normalize(upvotes?.get(regiment.id) || 0, 0, maxUpvoteValue, 1)

          return rating
        }

        sortedAndFilteredRegiments = filteredRegiments.sort((a: any, b: any) => {
          return rating(b) - rating(a)
        })
        break

      case 'newest':
        sortedAndFilteredRegiments = filteredRegiments.sort(
          (a: any, b: any) => b.established.seconds - a.established.seconds,
        )
        break
      case 'oldest':
        sortedAndFilteredRegiments = filteredRegiments.sort(
          (a: any, b: any) => a.established.seconds - b.established.seconds,
        )
        break
      case 'most-players':
        sortedAndFilteredRegiments = filteredRegiments.sort(
          (a: any, b: any) => b.players - a.players,
        )
        break
      case 'least-players':
        sortedAndFilteredRegiments = filteredRegiments.sort(
          (a: any, b: any) => a.players - b.players,
        )
        break
    }
  }

  return sortedAndFilteredRegiments
}

const capitalize = (activity: string) => {
  return activity.charAt(0).toUpperCase() + activity.slice(1)
}
</script>

<style>
.p-select,
.p-multiselect {
  border: none !important;
}

.faction_0 .p-togglebutton.p-togglebutton-checked::before {
  background: #4ade80;
  opacity: 0.8;
}

.faction_1 .p-togglebutton.p-togglebutton-checked::before {
  background: #38bdf8;
  opacity: 0.8;
}

.faction_2 .p-togglebutton.p-togglebutton-checked::before {
  background: linear-gradient(45deg, #4ade80, #38bdf8);
  opacity: 0.8;
}

.p-multiselect {
  gap: 1rem;
}

.p-paginator-page, .p-paginator-next, .p-paginator-last, .p-paginator-first, .p-paginator-prev {
  border-radius: 6px !important;
}

.p-chip[aria-label="💀 Hardcore"] {
  background: var(--p-tag-danger-background);
  color: var(--p-tag-danger-color);
}

.p-chip[aria-label="💀 Hardcore"] .p-chip-label {
  font-weight: var(--p-tag-font-weight);
}
</style>
