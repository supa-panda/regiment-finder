<template>
  <div class="w-full flex justify-center pb-5">
    <div class="container max-w-200 mx-auto">
      <Card v-if="!regimentStore.userRegiment || !regimentStore.userRegiment.premium" class="p-4">
        <template #header>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl">Support RegimentFinder</h1>
            <Tag severity="danger"><i class="pi pi-icon pi-heart-fill"></i></Tag>
          </div>
          <p class="text-sm pt-2">If you like regiment finder tool and are willing to support it you can do it by clicking the KoFi link at the bottom of the page or by buying a supporter badge.
            <br><br>You can choose one of the options to support the tool with monetary value and as an appreciation you will get a supporter badge and ability to customize your listing design. These are one time non-recurring payments (not subscriptions)</p>
          <br><br>
          <div class="flex flex-wrap md:flex-nowrap justify-between pt-4 gap-2">
            <Button :loading="loading3" size="large" severity="secondary" @click="buy(3)" class="w-full">
              <ProgressSpinner v-if="loading3" style="width: 20px; height: 20px" />
              <Tag severity="success"><span style="font-size: 1rem; font-weight: 700;">€2.99</span></Tag> <small>support for 30 days</small>
            </Button>
            <Button :loading="loading5" size="large" severity="secondary" @click="buy(5)" class="w-full">
              <ProgressSpinner v-if="loading5" style="width: 20px; height: 20px" />
              <Tag severity="success" ><span style="font-size: 1rem; font-weight: 700;">€4.99</span></Tag> <small>support for 60 days</small>
            </Button>
            <Button :loading="loading8" size="large" severity="secondary" @click="buy(8)" class="w-full">
              <ProgressSpinner v-if="loading8" style="width: 20px; height: 20px" />
              <Tag severity="success"><span style="font-size: 1rem; font-weight: 700;">€7.99</span></Tag> <small>support for 100 days</small>
            </Button>
          </div>

          <br><br>
          <Fieldset legend="Randomised customization preview" class="mt-4" v-if="regimentStore.userRegiment">
            <div class="flex justify-center py-4">
              <RegimentCard :regiment="regimentStore.userRegiment" :premiumPreview="true" style="max-width: 400px"/>
            </div>
          </Fieldset>
          <Fieldset v-else legend="Heads up" class="mt-4">
            <div class="flex justify-center py-4">
              In order to buy a supporter badge, you need to create a regiment first. You can do that by navigating the menu on the top right corner
            </div>
          </Fieldset>
        </template>
      </Card>
      <Card v-else class="p-4">
        <template #header>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl">Support RegimentFinder</h1>
            <Tag severity="danger"><i class="pi pi-icon pi-heart-fill"></i></Tag>
            <Tag severity="success" v-if="regimentStore.userRegiment.premium">Active</Tag>
          </div>
          <br><br>
          <Tag severity="success" class="w-full">
            Supporter badge valid until {{ new Date(regimentStore.userRegiment.active_until).toLocaleDateString() }}
          </Tag>
          <Fieldset legend="Template selection" class="mt-4">
            <div class="flex flex-wrap gap-4">
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-2">
                  <RadioButton v-model="regimentStore.userRegiment.template" name="template" :value="-1" :label="`None`"/>
                  <label for="template" class="text-sm">None</label>
                </div>
                <div v-for="i in 23" :key="i" class="flex items-center gap-2">
                  <RadioButton v-model="regimentStore.userRegiment.template" name="template" :value="i-1" :label="`Template ${i}`"/>
                  <label for="template" class="text-sm">Template {{ i }}</label>
                </div>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Border selection" class="mt-4">
            <div class="flex flex-wrap gap-4">
              <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-2">
                  <RadioButton v-model="regimentStore.userRegiment.border" name="border" :value="-1" :label="`None`"/>
                  <label for="border" class="text-sm">None</label>
                </div>
                <div v-for="i in 12" :key="i" class="flex items-center gap-2">
                  <RadioButton v-model="regimentStore.userRegiment.border" name="border" :value="i - 1" :label="`Border ${i}`"/>
                  <label for="border" class="text-sm">Border {{ i }}</label>
                </div>
              </div>
            </div>
          </Fieldset>

          <Fieldset legend="Actions" class="mt-4">
            <div class="flex justify-between">
              <Button severity="success" :loading="saveLoading" @click="save()" label="Save settings" icon="pi pi-save"/>
            </div>
          </Fieldset>

          <br><br>
          <Fieldset legend="Preview" class="mt-4">
            <div class="flex justify-center py-4">
              <RegimentCard :regiment="regimentStore.userRegiment" :premiumPreview="true" style="max-width: 400px"/>
            </div>
          </Fieldset>
        </template>
      </Card>
    </div>
  </div>
</template>
<script setup lang="ts">
import RegimentCard from '@/components/RegimentCard.vue'
import { useRegimentStore } from '@/stores/regiment.ts'
import { onUnmounted, ref } from 'vue'
import { useCurrentUser } from 'vuefire'
import { useToast } from 'primevue/usetoast'

const regimentStore = useRegimentStore()
const toast = useToast()
const saveLoading = ref(false)
const loading3 = ref(false)
const loading5 = ref(false)
const loading8 = ref(false)

const interval = setInterval(() => {
  if (!regimentStore.userRegiment) return;
  if (regimentStore.userRegiment.premium) {
    clearInterval(interval)
    return;
  }
  regimentStore.userRegiment.template = Math.floor(Math.random() * 23)
  regimentStore.userRegiment.border = Math.floor(Math.random() * 12)
}, 1000)


const save = async () => {
  saveLoading.value = true
  // @ts-expect-error TODO: Fix this
  await regimentStore.savePremium(useCurrentUser()?.value?.uid, regimentStore.userRegiment.border, regimentStore.userRegiment.template)
  toast.add({ severity: 'success', summary: 'Success', detail: 'Your settings have been saved.' })
  saveLoading.value = false
}

const buy = async (amount: number) => {
  if (!regimentStore.userRegiment) return;
  const url = 'https://us-central1-regiment-finder.cloudfunctions.net/createCheckoutSession';
  let priceId = '';
  const activeUntil = new Date();

  switch (amount) {
    case 3:
      priceId = 'price_1Qv3vQLKiJDaKoTGcmYTgnLm';
      activeUntil.setDate(activeUntil.getDate() + 30);
      loading3.value = true;
      break;
    case 5:
      priceId = 'price_1QuhacLKiJDaKoTG6chvM0GA';
      activeUntil.setDate(activeUntil.getDate() + 60);
      loading5.value = true;
      break;
    case 8:
      priceId = 'price_1QuhapLKiJDaKoTGCXnsLrHc';
      activeUntil.setDate(activeUntil.getDate() + 100);
      loading8.value = true;
      break;
  }

  const token = await useCurrentUser()?.value?.getIdToken()

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      user_id: useCurrentUser()?.value?.uid,
      active_until: activeUntil.toISOString(),
    }),
  }).then(async (res) => {
    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    }

    loading3.value = false;
    loading5.value = false;
    loading8.value = false;
  }).catch((err) => {
    console.error(err)
    loading3.value = false;
    loading5.value = false;
    loading8.value = false;
  })
}

onUnmounted(() => {
  clearInterval(interval)
})
</script>
