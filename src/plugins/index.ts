/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import { i18n } from '@/plugins/vue-i18n.ts'
import pinia from '../stores'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
    app
        .use(vuetify)
        .use(router)
        .use(pinia)
        .use(i18n)
}
