import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import { VueReCaptcha } from 'vue-recaptcha-v3'

// PrimeVue components
import {
  Button,
  IconField,
  InputText,
  InputIcon,
  Card,
  ToggleSwitch,
  SelectButton,
  Select,
  MultiSelect,
  Paginator,
  Tag,
  Drawer,
  Avatar,
  InputNumber,
  Message,
  Textarea,
  IftaLabel,
  RadioButton,
  RadioButtonGroup,
  Checkbox,
  CheckboxGroup,
  Fieldset,
  DatePicker,
  Password,
  ProgressSpinner,
  Dialog,
  Tooltip,
  Toast,
  FileUpload,
  Skeleton,
  Accordion,
  AccordionPanel,
  AccordionHeader,
  AccordionContent,
  Divider,
  InputGroup,
  InputGroupAddon,
} from 'primevue'

import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Editor from 'primevue/editor'
import { Form } from '@primevue/forms'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueReCaptcha, {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  loaderOptions: {
    autoHideBadge: true,
  },
})

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.100}',
          activeColor: '{zinc.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: Noir,
    options: {
      darkModeSelector: '.dark',
    },
  },
})

app.component('Button', Button)
app.component('IconField', IconField)
app.component('InputText', InputText)
app.component('InputIcon', InputIcon)
app.component('Card', Card)
app.component('ToggleSwitch', ToggleSwitch)
app.component('SelectButton', SelectButton)
app.component('Select', Select)
app.component('MultiSelect', MultiSelect)
app.component('Paginator', Paginator)
app.component('Tag', Tag)
app.component('Drawer', Drawer)
app.component('Avatar', Avatar)
app.component('Form', Form)
app.component('InputNumber', InputNumber)
app.component('Message', Message)
app.component('Textarea', Textarea)
app.component('IftaLabel', IftaLabel)
app.component('RadioButton', RadioButton)
app.component('RadioButtonGroup', RadioButtonGroup)
app.component('Checkbox', Checkbox)
app.component('CheckboxGroup', CheckboxGroup)
app.component('Fieldset', Fieldset)
app.component('DatePicker', DatePicker)
app.component('Password', Password)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Dialog', Dialog)
app.component('Editor', Editor)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast', Toast)
app.component('FileUpload', FileUpload)
app.component('Skeleton', Skeleton)
app.component('Accordion', Accordion)
app.component('AccordionPanel', AccordionPanel)
app.component('AccordionHeader', AccordionHeader)
app.component('AccordionContent', AccordionContent)
app.component('Divider', Divider)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)

app.directive('tooltip', Tooltip)
app.use(ConfirmationService)
app.use(ToastService)

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
})

app.mount('#app')
