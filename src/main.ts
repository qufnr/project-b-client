/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import 'material-symbols/index.scss'
import './assets/style/material-symbols/index.scss'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
