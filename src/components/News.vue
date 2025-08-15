<template>
  <div class="w-full" v-if="showNews">
    <Message
      severity="success"
      class="mb-4 p-2"
      closable
      @close="hideNews"
    >
      <div class="flex flex-col md:flex-row gap-2 flex-wrap items-start md:items-center">
        <Tag severity="success">
          <i class="pi pi-megaphone" />
          <strong>New feature</strong>
        </Tag>
        <span class="text-sm">
            You can now add your own short code and generate a custom invite link, for example: <span class="underline font-bold">regimentfinder.com/join/yourcode</span>.
            It's handy to always have an invite link ready!
          </span>
      </div>
    </Message>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// const showNews = ref(document.cookie.indexOf('hideNews=0423') === -1)
const showNews = ref(false)

const hideNews = () => {
  const date = new Date()
  date.setTime(date.getTime() + (10 * 24 * 60 * 60 * 1000))
  document.cookie = `hideNews=0423; expires=${date.toUTCString()}; path=/`
  showNews.value = false
}
</script>