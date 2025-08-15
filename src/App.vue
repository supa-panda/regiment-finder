<template>
  <Header />
  <RouterView />

  <div
    v-if="router.currentRoute.value.name === 'index' && !regimentStore.regimentsLoaded"
    class="flex flex-col justify-center items-center p-4"
  ></div>

  <div class="flex flex-col justify-center items-center p-4 footer">
    <small class="text-center"
      >Developed by
      <a href="https://discord.com/invite/ntSX8KvdN8" target="_blank" class="underline"
        >Hammer of Dawn</a
      >. For any questions, disputes or other issues join <a href="https://discord.gg/NGXdVsdUUB" target="_blank" class="underline">RobertluvsGames discord</a>
      <br />
      Regimentfinder.com is not associated with Foxhole or Siege Camp.</small
    >

    <a href="https://ko-fi.com/regimentfinder" class="p-2" target="_blank">
      <Button class="flex w-auto" size="small" severity="secondary">
        <img src="@/assets/kofi_symbol.svg" alt="Support me on Ko-fi" class="max-w-6" />
        <small
          >Support <span class="warden">Regiment</span><span class="colonial">Finder</span> on
          Ko-fi</small
        >
      </Button>
    </a>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import { useRegimentStore } from '@/stores/regiment.ts'
import router from '@/router'

const regimentStore = useRegimentStore()
</script>

<style>
.footer {
  min-height: 50px;
}

.warden {
  color: #38bdf8;
}

.colonial {
  color: #4ade80;
}
</style>
