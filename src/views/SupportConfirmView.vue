<template>
  <div class="w-full flex justify-center pb-5">
    <div class="container max-w-200 mx-auto">
      <Card class="p-4">
        <template #content>
          <div class="flex flex-col items-end gap-4">
            <Message v-if="loading" icon="pi pi-spin pi-spinner" severity="info" class="w-full">
              Processing...
            </Message>
            <Message v-if="notYetPremium" icon="pi pi-exclamation-triangle" severity="warn" class="w-full">
              Your payment is not yet processed. Your supporter badge will automatically activate once the payment is received, it is safe to close this page.
            </Message>
            <Message v-if="!loading && !notYetPremium" icon="pi pi-check" severity="success">
              You supporter badge is activated! You can now select a template and border for your regiment.
            </Message>
            <router-link to="/support" class="flex mt-4">
              <Button size="large" icon="pi pi-arrow-left" severity="secondary" label="Go back"/>
            </router-link>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegimentStore } from '@/stores/regiment.ts'
import { onMounted, ref } from 'vue'

const loading = ref(true)
const notYetPremium = ref(false)
const regimentStore = useRegimentStore()

onMounted(() => {
  regimentStore.getRegiments(true).then(() => {
    loading.value = false

    if (!regimentStore.userRegiment.premium) {
      notYetPremium.value = true
    }
  })
})

</script>
