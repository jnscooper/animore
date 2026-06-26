import './assets/main.css'
import '@fontsource/fugaz-one/400.css'
import 'lenis/dist/lenis.css'
import 'swiper/css'
import 'swiper/css/navigation'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'flyonui/flyonui'
import lenisVue from 'lenis/vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(lenisVue)

app.mount('#app')
