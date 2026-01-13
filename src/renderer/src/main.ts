import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router'
import { useSettingsStore } from './composables/settingsStore'
import { useUpdateStore } from './composables/useUpdateStore'
import { createTheme, Theme } from './components/codemirror/useTheme'
import VueCodeMirror from 'vue-codemirror'
import { useOptionsStore } from './composables/useOptionsStore'

const app = createApp(App)
app.use(createPinia())

const settingsStore = useSettingsStore()
await settingsStore.init()

const updateStore = useUpdateStore()
updateStore.initUpdateStore()

const optionsStore = useOptionsStore()
await optionsStore.init()

app.use(router)
app.use(VueCodeMirror, {
    options: {
        tabSize: 4,
        indentWithTab: true,
        lineWrapping: true
    }
})
app.use(createTheme(Theme.Dark))
app.mount('#app')
