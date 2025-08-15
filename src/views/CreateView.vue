<template>
  <div class="w-full flex justify-center pb-5">
    <div class="container max-w-200 mx-auto">
      <Card>
        <template #header>
          <h2 class="p-5">Fill in the form and create your regiment listing</h2>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <Form
              v-if="!successMessage"
              v-slot="$form"
              :initialValues
              :resolver
              @submit="onFormSubmit"
              class="flex flex-col gap-4 w-full"
            >
              <div class="flex flex-col gap-4">
                <Fieldset legend="Faction">
                  <div class="flex flex-wrap gap-4">
                    <RadioButtonGroup name="faction" class="flex flex-wrap gap-4">
                      <div class="flex items-center gap-2">
                        <RadioButton inputId="colonial" value="0" />
                        <label for="colonial">Colonial</label>
                      </div>
                      <div class="flex items-center gap-2">
                        <RadioButton inputId="warden" value="1" />
                        <label for="warden">Warden</label>
                      </div>
                      <div class="flex items-center gap-2">
                        <RadioButton inputId="neutral" value="2" />
                        <label for="neutral">Neutral</label>
                      </div>
                    </RadioButtonGroup>
                  </div>
                  <Message
                    v-if="$form.faction?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.faction.error?.message }}
                  </Message>
                </Fieldset>

                <Fieldset legend="Shard">
                  <CheckboxGroup name="shard" class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="able" value="able" />
                      <label for="able"> Able </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="baker" value="baker" />
                      <label for="baker"> Baker </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="charlie" value="charlie" />
                      <label for="charlie"> Charlie </label>
                    </div>
                  </CheckboxGroup>

                  <Message
                    v-if="$form.shard?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $form.shard.error?.message }}</Message
                  >
                </Fieldset>

                <Fieldset legend="Regions">
                  <div class="flex flex-col gap-4">
                    <CheckboxGroup name="timezones" class="flex flex-wrap gap-4">
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="Global" value="global" />
                        <label for="global"> 🌐 Global </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="America" value="america" />
                        <label for="america"> North America </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="SouthAmerica" value="southamerica" />
                        <label for="southamerica"> South America </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="Europe" value="europe" />
                        <label for="europe"> Europe </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="Africa" value="africa" />
                        <label for="africa"> Africa </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="middle-east" value="middle-east" />
                        <label for="middle-east"> Middle east </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="Asia" value="asia" />
                        <label for="asia"> Asia </label>
                      </div>
                      <div class="flex items-center gap-2">
                        <Checkbox inputId="Oceania" value="oceania" />
                        <label for="oceania"> Oceania </label>
                      </div>
                    </CheckboxGroup>

                    <Message v-if="$form.timezones?.invalid" severity="error" icon="pi pi-times">{{
                      $form.timezones.error?.message
                    }}</Message>
                    <Message v-if="timezoneWarning" severity="info" icon="pi pi-info-circle">{{
                      timezoneWarning
                    }}</Message>
                  </div>
                </Fieldset>

                <Fieldset legend="Image">
                  <div class="flex flex-col items-start gap-2">
                    <FileUpload
                      name="image"
                      @select="onFileSelect"
                      :multiple="false"
                      accept="image/*"
                      :maxFileSize="5000000"
                      :choose-icon="'pi pi-upload'"
                      mode="basic"
                      class="overflow-hidden"
                    >
                    </FileUpload>

                    <img
                      v-if="image"
                      :src="image"
                      alt="Uploaded image"
                      class="regiment-image rounded-xl mt-2"
                    />
                  </div>
                </Fieldset>

                <IftaLabel>
                  <MultiSelect
                    name="languages"
                    :options="languages"
                    optionLabel="name"
                    placeholder="Select language(s)"
                    display="chip"
                    :showToggleAll="false"
                    filter
                    auto-filter-focus
                    show-clear
                    fluid
                    :maxSelectedLabels="5"
                  />
                  <label for="languages">Language(s)</label>
                </IftaLabel>
                <Message
                  v-if="$form.languages?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.languages.error?.message }}</Message
                >

                <IftaLabel>
                  <label for="name">Regiment name*</label>
                  <InputText name="name" type="text" require fluid />
                </IftaLabel>
                <Message
                  v-if="$form.name?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.name.error?.message }}</Message
                >

                <IftaLabel>
                  <label for="clantag">Regiment tag (in-game)*</label>
                  <InputText name="clantag" type="text" require fluid />
                </IftaLabel>
                <Message
                  v-if="$form.clantag?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.clantag.error?.message }}</Message
                >

                <IftaLabel>
                  <label for="slogan">Slogan</label>
                  <InputText name="slogan" type="text" require fluid />
                </IftaLabel>
                <Message
                  v-if="$form.slogan?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.slogan.error?.message }}</Message
                >

                <Message severity="info" class="py-2">
                  <div class="flex flex-col gap-2 items-start">
                    <Tag severity="info"><i class="pi pi-icon pi-question-circle"></i>What are active players?</Tag>
                    <p>Active players are not total discord members or total regiment members because these numbers are not accurate representation of gameplay experience in your regiment. Try to estimate the number of players that you gather for operations, or on weekends, when your regiment has most activity. If there is a suspicion that this number for your regiment is not accurate you might be asked for a confirmation</p>
                    <IftaLabel class="w-full">
                      <InputNumber :format="false" name="players" require fluid />
                      <label for="players">Active player count (number)*</label>
                    </IftaLabel>
                    <Message
                      v-if="$form.players?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                    >{{ $form.players.error?.message }}</Message
                    >
                  </div>
                </Message>

                <Fieldset legend="Specializations">
                  <CheckboxGroup name="activities" class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="airborne" value="airborne" />
                      <label for="airborne"> Airborne </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="artillery" value="artillery" />
                      <label for="artillery"> Artillery </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="facilities" value="facilities" />
                      <label for="facilities"> Facilities </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="infantry" value="infantry" />
                      <label for="infantry"> Infantry </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="logistics" value="logistics" />
                      <label for="logistics"> Logistics </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="naval" value="naval" />
                      <label for="naval"> Naval </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="partisan" value="partisan" />
                      <label for="partisan"> Partisan </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="tanks" value="tanks" />
                      <label for="tanks"> Tanks </label>
                    </div>
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="engineering" value="engineering" />
                      <label for="engineering"> Engineering </label>
                    </div>
                    <Divider />
                    <div class="flex items-center gap-2">
                      <Checkbox inputId="hardcore" value="hardcore" />
                      <label for="hardcore"> <Tag severity="danger">💀 Hardcore</Tag> <span class="text-sm text-red-300">Select if your regiment is hardcore (strict roleplay, mandatory playtime etc.)</span> </label>
                    </div>
                  </CheckboxGroup>

                  <Message
                    v-if="$form.activities?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    class="mt-2 pt-4"
                  >{{ $form.activities.error?.message }}</Message
                  >
                </Fieldset>

                <IftaLabel>
                  <label for="short_desc">Short description (displayed on list page)* </label>
                  <div>
                    <Textarea
                      name="short_desc"
                      type="text"
                      require
                      fluid
                      :max="10"
                      v-model="shortDesctext"
                    />
                    <small class="absolute right-1 top-1">{{ shortDesctext.length }}/150</small>
                  </div>
                </IftaLabel>
                <Message
                  v-if="$form.short_desc?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.short_desc.error?.message }}</Message
                >

                <div class="relative">
                  <Editor
                    name="long_desc"
                    editorStyle="height: 320px"
                    required
                    fluid
                    maxlength="2500"
                    placeholder="Long description"
                    v-model="longDesctext"
                  />
                  <small class="absolute right-3 top-3">{{ longDesctext.length }}/2500</small>
                </div>
                <Message
                  v-if="$form.long_desc?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.long_desc.error?.message }}</Message
                >

                <IftaLabel>
                  <label for="discord">Discord URL*</label>
                  <InputText name="discord" type="text" fluid />
                </IftaLabel>
                <Message
                  v-if="$form.discord?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ $form.discord.error?.message }}</Message
                >

                <InputGroup >
                  <InputGroupAddon class="md:w-80">
                    regimentfinder.com/join/
                  </InputGroupAddon>
                  <IftaLabel>
                    <InputText name="shortlink" type="text" fluid />
                    <label for="shortlink">Short URL</label>
                  </IftaLabel>
                </InputGroup>
                <Message
                  v-if="$form.shortlink?.invalid"
                  severity="error"
                  size="small"
                  variant="simple"
                >{{ $form.shortlink.error?.message }}</Message
                >

                <IftaLabel>
                  <div class="flex flex-col gap-1">
                    <label for="established">Regiment creation date*</label>
                    <DatePicker name="established" fluid />
                    <Message
                      v-if="$form.established?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $form.established.error?.message }}</Message
                    >
                  </div>
                </IftaLabel>
              </div>
              <Message v-if="error" severity="error" size="small" variant="simple">{{
                error
              }}</Message>
              <Button
                type="submit"
                :loading="loading"
                severity="primary"
                label="Create regiment listing"
              />
            </Form>
            <Message v-if="successMessage" severity="success" size="small">{{
              successMessage
            }}</Message>
            <div v-if="successMessage" class="flex items-center gap-4 justify-end flex-wrap">
              <RouterLink to="/manage">
                <Button severity="secondary" class="mt-2">
                  <span class="text-sm">Go to dashboard</span>
                </Button>
              </RouterLink>
            </div>
            <Message v-if="errorMessage" severity="error" size="small">{{ errorMessage }}</Message>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { db } from '@/firebase'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useCurrentUser } from 'vuefire'
import { useRegimentStore } from '@/stores/regiment.ts'
import { languageList } from '@/helpers/languages.ts'

const regimentStore = useRegimentStore()
const errorMessage = ref('')
const successMessage = ref('')
const initialValues = ref({
  name: '',
  slogan: '',
  faction: 0,
  shard: [],
  timezones: [],
  languages: [],
  players: '',
  activities: [],
  long_desc: '',
  short_desc: '',
  image: '',
  discord: '',
  established: '',
  clantag: '',
  shortlink: '',
})

const loading = ref(false)
const image = ref()
const timezoneWarning = ref('')

const onFileSelect = (event: any) => {
  const file = event.files[0]
  event.files = [file]
  const reader = new FileReader()

  reader.onload = async (e) => {
    image.value = e.target?.result
  }

  reader.readAsDataURL(file)
}

// @ts-expect-error Todo: Fix this
const resolver = ({ values }) => {
  const errors = {} as Record<string, any>

  if (!values.faction) {
    errors.faction = [{ message: 'Faction is required.' }]
  }

  if (!values.shard || !values.shard.length) {
    errors.shard = [{ message: 'Shard is required.' }]
  }

  if (!values.timezones || !values.timezones.length) {
    errors.timezones = [{ message: 'At least one timezone is required.' }]
  }

  if (values.timezones.includes('global') && values.timezones.length > 1) {
    errors.timezones = [{ message: 'If you choose Global, you cannot choose other timezones.' }]
  }

  if (values.timezones.includes('global')) {
    timezoneWarning.value =
      'If you choose Global as a timezone, your regiment will be displayed in all timezones. Only choose it if you have members from all over the world.'
  } else {
    timezoneWarning.value = ''
  }

  if (!values.languages || !values.languages.length) {
    errors.languages = [{ message: 'At least one language is required.' }]
  }

  if (values.languages.length > 5) {
    errors.languages = [{ message: 'Maximum of 5 languages allowed.' }]
  }

  if (!values.name) {
    errors.name = [{ message: 'Regiment name is required.' }]
  }

  if (!values.clantag) {
    errors.clantag = [{ message: 'Regiment tag is required.' }]
  }

  if (!values.players) {
    errors.players = [{ message: 'Active player count is required.' }]
  }

  if (values.players > 1000) {
    errors.players = [{ message: 'Active player count must be 1000 or less. If you really have more than 1k active players, please contact on discord' }]
  }

  if (!values.activities.length) {
    errors.activities = [{ message: 'At least one specialization is required.' }]
  }

  const hardcoreIndex = values.activities.findIndex((activity: string) => activity === 'hardcore')
  if (values.activities.length > (hardcoreIndex !== -1 ? 5 : 4)) {
    errors.activities = [{ message: 'Maximum of 4 specializations allowed (hardcore not included)' }]
  }

  if (!values.short_desc) {
    errors.short_desc = [{ message: 'Short description is required.' }]
  }

  if (values.short_desc && values.short_desc.length > 150) {
    errors.short_desc = [{ message: 'Short description must be 150 characters or less.' }]
  }

  if (values.long_desc && values.long_desc.length > 2500) {
    errors.short_desc = [{ message: 'Short description must be 2500 characters or less.' }]
  }

  if (!values.discord) {
    errors.discord = [{ message: 'Discord URL is required.' }]
  }

  if (values.shortlink) {
    const regex = /^[a-zA-Z0-9-]+$/
    if (values.shortlink.length > 20) {
      errors.shortlink = [{ message: 'Short link must be 20 characters or less.' }]
    }

    if (!regex.test(values.shortlink)) {
      errors.shortlink = [{ message: 'Short link can only contain alphanumeric characters and dashes.' }]
    }
  }

  if (!values.discord.startsWith('https://')) {
    errors.discord = [{ message: 'URL is invalid' }]
  }

  if (!values.established) {
    errors.established = [{ message: 'Regiment creation date is required.' }]
  }

  return {
    errors,
  }
}

const error = ref(null)

const onFormSubmit = async (values: any) => {
  // @ts-expect-error Todo: Fix this
  if (!useCurrentUser().value.uid) {
    // @ts-expect-error Todo: Fix this
    error.value = 'You must be logged in to create a regiment listing.'
  }

  if (Object.keys(values.errors).length) {
    return
  }

  loading.value = true

  if (values.states.shortlink.value) {
    const q = query(collection(db, 'regiment'), where('shortlink', '==', values.states.shortlink.value))
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length) {
      errorMessage.value = 'Short link already exists.'
      loading.value = false
      return
    }
  }

  function getDiscordInviteCode(url: string) {
    const match = url.match(/(?:discord\.gg\/|discord\.com\/invite\/)([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  }

  const discordInviteCode = getDiscordInviteCode(values.states.discord.value)

  if (!discordInviteCode) {
    errorMessage.value = 'Discord invite link is invalid.'
    loading.value = false
  }

  let breakFlow = false;

  if (discordInviteCode) {
    await fetch(' https://us-central1-regiment-finder.cloudfunctions.net/getDiscordInviteLink?invite_link=' + discordInviteCode, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`,
      },
    }).then(async (response) => {
      if (response.status !== 200) {
        errorMessage.value = 'Discord invite link is invalid.'
        loading.value = false
      }

      const data = await response.json()

      if (data.data.code === 10006) {
        errorMessage.value = 'Discord invite link is expired.'
        loading.value = false
        breakFlow = true;
        return;
      }

      if (data.data.expires_at !== null) {
        errorMessage.value = 'Discord invite link must be permanent (no expiration date).'
        loading.value = false

        breakFlow = true;
        return;
      }
    })
  }

  if (breakFlow) {
    return
  }

  const url =
    (await regimentStore
      .uploadImageAndGetUrl(image.value)
      .then((url) => {
        return url
      })
      .catch((error) => {
        errorMessage.value = error.message
        loading.value = false
      })) ?? ''

  const q = query(collection(db, 'regiment'), where('clantag', '==', values.states.clantag.value))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.docs.length > 0) {
    errorMessage.value = 'Regiment listing already exists.'
    return
  }

  // @ts-expect-error Todo: Fix this
  await setDoc(doc(db, 'regiment', useCurrentUser().value.uid), {
    name: values.states.name.value,
    slogan: values.states.slogan.value,
    faction: parseInt(values.states.faction.value),
    shard: values.states.shard.value,
    timezones: values.states.timezones.value,
    languages: values.states.languages.value,
    players: values.states.players.value,
    activities: values.states.activities.value,
    long_desc: values.states.long_desc.value,
    short_desc: values.states.short_desc.value,
    image: url,
    discord: values.states.discord.value,
    established: values.states.established.value,
    clantag: values.states.clantag.value,
    updated: new Date(),
    created: new Date(),
    shortlink: values.states.shortlink.value
  })
    .then(() => {
      successMessage.value = 'Regiment listing created successfully.'
      errorMessage.value = ''
      regimentStore.hasRegiment = true
      regimentStore.userRegiment = {
        name: values.states.name.value,
        slogan: values.states.slogan.value,
        faction: parseInt(values.states.faction.value),
        shard: values.states.shard.value,
        timezones: values.states.timezones.value,
        languages: values.states.languages.value,
        players: values.states.players.value,
        activities: values.states.activities.value,
        long_desc: values.states.long_desc.value,
        short_desc: values.states.short_desc.value,
        image: url,
        discord: values.states.discord.value,
        established: values.states.established.value,
        clantag: values.states.clantag.value,
        updated: new Date(),
        created: new Date(),
        shortlink: values.states.shortlink.value
      }
      regimentStore.refreshLocalStorage()
    })
    .catch((error) => {
      errorMessage.value = error.message
    })
}

const shortDesctext = ref('')
const longDesctext = ref('')
const languages = ref(languageList)
</script>

<style>
.ql-editor {
  background: #09090b !important;
}

.ql-editor.ql-blank::before {
  color: #a1a1aa !important;
}

.regiment-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.p-fileupload span {
  text-overflow: ellipsis;
  max-width: 20rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .p-fileupload span {
    max-width: 30rem;
  }
}
</style>
