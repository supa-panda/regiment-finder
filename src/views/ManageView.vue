<template>
<div class="w-full flex justify-center pb-5">
  <ConfirmDialog :draggable="false"></ConfirmDialog>
  <div class="container max-w-200 mx-auto">
    <Card>
      <template #content>
        <div v-if="regimentStore.userRegiment" class="flex flex-col gap-4">
          <News />
          <Stats />

          <div class="grid grid-cols-2 gap-4">
            <Button
              label="Edit regiment"
              icon="pi pi-pencil"
              class="w-full p-button-secondary"
              @click="$router.push({ name: 'edit' })"
            />
            <Button
              class="w-full flex p-button-secondary"
              @click="$router.push({ name: 'support' })"
            >
              <Tag severity="danger"><i class="pi pi-icon pi-heart-fill"></i></Tag>
              Support RegimentFinder
            </Button>
          </div>

          <Fieldset legend="Useful information" class="col-span-2" toggleable>
            <Accordion value="0">
              <AccordionPanel value="0">
                <AccordionHeader>Improving regiment rating (position in list)</AccordionHeader>
                <AccordionContent>
                  <p class="m-0">
                    Each regiment has a rating based on certain factors. The higher the rating, the better the regiment is positioned in the list. The rating is calculated based on the number of views, the quality of the listing and activity. To have a better
                    rating, you can improve your regiment listing by adding regiment picture, selecting less activity tags (selecting most important one instead of all), adding more information about the regiment and updating the listing each war. You can also purchase
                    supporter badge to increase the rating and position in the list a bit.
                  </p>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="1">
                <AccordionHeader>Content updates</AccordionHeader>
                <AccordionContent>
                  <p class="m-0">
                    Regiment lists get updated once every hour so it may take some time for your changes to be visible.
                  </p>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="2">
                <AccordionHeader>Neutral faction</AccordionHeader>
                <AccordionContent>
                  <p class="m-0">
                    If you want to be listed as a neutral regiment, you can select the "Neutral" faction. This will not affect your regiment rating or position in the list. You can also select "Neutral" faction if you are not sure about your regiment's faction. Your regiment will be displayed in both Colonial and Warden factions.
                  </p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </Fieldset>

          <Fieldset legend="RegimentFinder updates" class="col-span-2" collapsed toggleable>
            <div class="flex flex-col gap-4">
              <Message severity="info">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <Tag severity="warn">2025-04-23</Tag><Tag severity="info">v1.1.1</Tag>
                  </div>
                  <p class="text-white">
                    Implemented automatic reminder emails about regiment expiration. Emails will be sent 10 days before expiration day and on expiration day. Added
                    cosmetic changes to reflect collaboration with RobertLuvsgames.
                  </p>
                </div>
              </Message>

              <Message severity="info">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <Tag severity="warn">2025-03-29</Tag><Tag severity="info">v1.1.0</Tag>
                  </div>
                  <p class="text-white">
                    Fixed various bugs, added neutral faction, improved regiment rating calculation, introduced new regiment managing UI
                  </p>
                </div>
              </Message>

              <Message severity="info">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <Tag severity="warn">2025-02-18</Tag><Tag severity="info">v1.0.3</Tag>
                  </div>
                  <p class="text-white">
                    Introduced image uploading
                  </p>
                </div>
              </Message>

              <Message severity="info">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <Tag severity="warn">2025-02-16</Tag><Tag severity="info">v1.0.2</Tag>
                  </div>
                  <p class="text-white">
                    Introduced language & timezone filters
                  </p>
                </div>
              </Message>

              <Message severity="info">
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <Tag severity="warn">2025-02-15</Tag><Tag severity="info">v1.0.1</Tag>
                  </div>
                  <p class="text-white">
                    Improved list caching for better performance
                  </p>
                </div>
              </Message>
            </div>
          </Fieldset>

          <div class="grid grid-cols-2 gap-4 mt-[5rem]">
            <Fieldset legend="Danger zone" class="col-span-2">
              <div class="flex justify-between">
                <Button
                  label="Delete regiment"
                  icon="pi pi-trash"
                  class="w-full p-button-danger"
                  @click="confirmDelete()"
                />
              </div>
            </Fieldset>
          </div>
        </div>
        <div v-else class="flex flex-col gap-4">
          <h1 class="text-2xl">No regiment found</h1>
          <p class="text-surface-500 dark:text-surface-300">
            You don't have a regiment listed. You can create one by clicking the button below.
          </p>
          <Button
            label="Create regiment"
            icon="pi pi-plus"
            class="w-full p-button-secondary"
            @click="$router.push({ name: 'create' })"
          />
        </div>
      </template>
    </Card>
  </div>
</div>
</template>

<script setup lang="ts">
import Stats from '@/components/Stats.vue'
import { useRegimentStore } from '@/stores/regiment.ts'
import { getCurrentUser } from 'vuefire'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import router from '@/router'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import News from '@/components/News.vue'

const regimentStore = useRegimentStore()
const confirm = useConfirm()
const toast = useToast()

const confirmDelete = () => {
  confirm.require({
    message: 'Do you want to delete ' + regimentStore.userRegiment?.name + ' regiment listing?',
    header: 'Danger Zone',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      const user = await getCurrentUser()
      if (!user) {
        return
      }
      deleteDoc(doc(db, 'regiment', user?.uid))
        .then(() => {
          regimentStore.hasRegiment = false
          regimentStore.userRegiment = null
          regimentStore.refreshLocalStorage()
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Regiment deleted',
            life: 3000,
          })
          router.push('/')
        })
        .catch(() => {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete regiment',
            life: 3000,
          })
        })
    },
    reject: () => {},
  })
}


</script>

<style scoped>
.stat-card {
  background-color: var(--p-surface-700);
}
</style>