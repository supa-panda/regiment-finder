<template>
  <div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-gray-800 shadow p-4 rounded-xl">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Listing views</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-lg">
                {{ regimentUpvotes }}
              </div>
            </div>
            <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/30 rounded w-10 h-10">
              <i class="pi pi-eye text-blue-500 dark:text-blue-200 !text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-gray-800 shadow p-4 rounded-xl">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Listing rating</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-lg">
                Top {{ regimentRating }}%
              </div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/30 rounded w-10 h-10">
              <i class="pi pi-crown text-orange-500 dark:text-orange-200 !text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-gray-800 p-4 rounded-xl">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Last update</span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-lg">
                {{ new Date(regimentStore.userRegiment?.updated.seconds * 1000).toLocaleDateString() }}
              </div>
            </div>
            <div class="w-10 h-10 flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/30 rounded">
              <i class="pi pi-clock text-cyan-500 dark:text-cyan-200 !text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-3">
        <div class="bg-gray-800 shadow p-4 rounded-xl">
          <div class="flex justify-between mb-4">
            <div>
              <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">
                Expires on
                <i
                  class="pi pi-info-circle text-surface-500 dark:text-surface-300 !text-sm"
                  v-tooltip.top="'Your regiment listing will be hidden from list on this date. Update your listing regularly to keep it active.'"
                  placeholder="Top"
                />
              </span>
              <div class="text-surface-900 dark:text-surface-0 font-medium !text-lg">
                {{ new Date(new Date(regimentStore.userRegiment?.updated.seconds * 1000).setMonth(new Date().getMonth() + 2)).toLocaleDateString() }}
              </div>
            </div>
            <div class="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-red-400/30 rounded">
              <i class="pi pi-exclamation-triangle text-purple-500 dark:text-purple-200 !text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegimentStore } from '@/stores/regiment.ts'
import { onMounted, type Ref, ref } from 'vue'

const regimentStore = useRegimentStore()
const upvotes: Ref<Map<string, number> | undefined> = ref(new Map())
const regimentUpvotes = ref(0)
const regimentRating = ref(0)

const computeRegimentUpvotes = async (): Promise<void> => {
  const userRegiment = regimentStore.userRegiment ?? await regimentStore.getUserRegiment();
  upvotes.value = await regimentStore.getUpvotes()

  if (upvotes.value && userRegiment) {
    regimentUpvotes.value = upvotes.value.get(userRegiment.id) || 0
  }
}

const computeRegimentRating = async (): Promise<void> => {
  const regiments = await regimentStore.getRegiments()
  const maxUpvoteValue = upvotes.value ? Math.max(...Array.from(upvotes.value.values())) : 0

  const maxPlayerValue = Math.max(
    ...regiments.map((regiment: any) => regiment.players),
  )

  const normalize = (val: number, min: number, max: number, scale: number = 1) => {
    if (max === min) return 0 // Prevent division by zero
    return ((val - min) / (max - min)) * scale
  }

  const rating = (regiment: any) => {
    let rating = 0
    if (regiment.image && regiment.image !== '') rating += 5
    if (regiment.premium) rating += 2
    if (regiment.short_desc) rating++
    if (regiment.long_desc) rating++
    if (regiment.slogan) rating++
    if (regiment.activities.length > 3) rating--
    if (regiment.activities.length > 5) rating--

    rating += normalize(regiment.players, 0, maxPlayerValue, 1) // Normalize players to [0,2]
    rating += normalize(upvotes.value?.get(regiment.id) || 0, 0, maxUpvoteValue, 1) // Normalize upvotes to [0,2]

    return rating
  }

  const maxRating = 10
  const computedRate = rating(regimentStore.userRegiment)
  regimentRating.value = 100 - Math.round((computedRate / maxRating) * 100)
}

onMounted(async () => {
  await computeRegimentUpvotes()
  await computeRegimentRating()
})
</script>
