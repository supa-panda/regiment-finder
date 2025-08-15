<template>
  <Button
    @click="toggleSearch"
    class="w-fit lg:ms-auto"
    severity="secondary"
    size="small"
  >
    <i class="pi pi-icon pi-search"></i>
    <span class="">Search</span>
    <Tag class="hidden lg:inline shortcut" size="small">Ctrl K</Tag>
  </Button>

  <div class="search-container" v-if="searchVisible">
    <div :class="'search-box ' + (searchTerm ? 'no-bottom-radius' : '')" ref="target">
      <i
        class="pi pi-search absolute top-1/2 left-5 transform -translate-y-1/2 text-[2rem] text-white search-icon"
      ></i>
      <input
        type="text"
        placeholder="Search by name or tag.."
        :class="'invisible-input ' + (searchTerm ? 'no-bottom-radius' : '')"
        ref="searchbar"
        v-model="searchTerm"
      />
      <div v-if="searchTerm" class="search-results">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div v-if="foundRegiments.length === 0" class="text-center">
              <p class="text-md text-gray-400 p-5">No regiments found.</p>
            </div>
            <div v-for="regiment in foundRegiments" :key="regiment.id" class="flex gap-2 items-center p-4 rounded-md hover:bg-gray-800 cursor-pointer" @click="openModal(regiment)">
              {{ regiment.name }}
              <Tag class="text-sm text-gray-500">{{ regiment.clantag }}</Tag>
              <Tag class="text-sm text-gray-500" :severity="regiment.faction === 0 ? 'success' : 'info'">
                {{ regiment.faction === 0 ? 'Colonial' : 'Warden' }}
              </Tag>
              <Tag class="text-sm text-gray-500">
                <i class="pi pi-users" />
                {{ regiment.players }}
              </Tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRegimentStore } from '@/stores/regiment.ts'
import { useMagicKeys, whenever } from '@vueuse/core'
import type { Regiment } from '@/types/Regiment.ts'

const regimentStore = useRegimentStore()
const searchVisible = ref(false)
const searchTerm = ref('')
const target = useTemplateRef<HTMLElement>('target')

onClickOutside(target, () => toggleSearch())

const toggleSearch = () => {
  searchVisible.value = !searchVisible.value
  if (searchVisible.value) {
    setTimeout(() => {
      const searchbar = document.querySelector('.invisible-input') as HTMLInputElement
      searchbar.focus()
    }, 0)
  }

  document.body.style.overflow = searchVisible.value ? 'hidden' : 'auto'
}



const foundRegiments = computed(() => {
  if (!searchTerm.value) return []
  return regimentStore.regiments.filter((regiment: Regiment) => {
    const foundByName = regiment.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const foundByClantag = regiment.clantag.toLowerCase().includes(searchTerm.value.toLowerCase())

    return foundByName || foundByClantag
  })
})

const openModal = (regiment: Regiment) => {
  regimentStore.dialogRegiment = regiment
  regimentStore.showRegimentDialog = true
}

const { ctrl_k } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  },
})

whenever(ctrl_k, () => toggleSearch())

</script>

<style scoped>
@keyframes slideup {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}

.search-icon {
  font-size: 1.5rem;
}

.search-container {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: var(--surface-100);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-2);
  z-index: 10;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  backdrop-filter: blur(3px);
  background: rgba(0, 0, 0, 0.5);
  transition: all 150ms ease;
  animation: slideup 0.1s ease-in-out;
}

.search-box {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 50vw;
  background: var(--p-surface-800);
  border-radius: 1.5rem;
  min-height: 4rem;
}

.invisible-input {
  position: absolute;
  border: none;
  width: 100%;
  height: 100%;
  min-height: 4rem;
  font-size: 1.5rem;
  border-radius: 1.5rem;
  padding-left: 4rem;
}

.invisible-input:focus {
  outline: none;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--p-surface-800);
  border-radius: 0 0 1.5rem 1.5rem;
  max-height: calc(50vh - 4rem);
  overflow-y: auto;
}

.no-bottom-radius {
  border-radius: 1.5rem 1.5rem 0 0;
}

@media (max-width: 768px) {
  .search-box {
    top: 0;
    transform: translate(-50%, 0);
    max-width: 100vw;
    padding: 1rem;
    border-radius: 0;
  }

  .invisible-input {
    top: 0;
    left: 0;
    border-radius: 0;
  }

  .search-results {
    max-height: calc(80vh - 4rem);
  }

  .shortcut {
    display: none;
  }
}

.shortcut {
  background: #121212;
  font-size: 0.6rem;
}
</style>