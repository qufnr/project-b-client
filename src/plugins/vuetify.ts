/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

import { materialSymbols, aliases as materialAliases } from '@/plugins/material-symbols.ts'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    icons: {
        defaultSet: 'materialSymbols',
        aliases: materialAliases,
        sets: { materialSymbols },
    },
    theme: {
        defaultTheme: 'system',
    },
})
