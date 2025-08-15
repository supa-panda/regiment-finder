<template>
  <div class="w-full flex justify-center pb-5">
    <div class="container max-w-200 mx-auto">
      <Card class="p-4">
        <template #content>
          <div class="flex flex-col gap-4">
            <Message icon="pi pi-times" severity="error">
              Payment error
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

</script>
