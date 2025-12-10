/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

//  Material Symbols
import 'material-symbols/index.scss'
import '@/assets/style/material-symbols/index.scss'
import { materialSymbols, aliases as materialAliases } from '@/plugins/material-symbols.ts'

// Composables
import { createVuetify } from 'vuetify'

import { md3 } from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    blueprint: md3,
    icons: {
        defaultSet: 'materialSymbols',
        aliases: materialAliases,
        sets: { materialSymbols },
    },
    theme: {
        defaultTheme: 'system',
    },
})
