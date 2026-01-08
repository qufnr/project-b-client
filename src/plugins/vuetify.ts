/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/assets/style/index.scss'

//  Material Symbols
import 'material-symbols/index.scss'
import '@/assets/style/material-symbols/index.scss'
import { materialSymbols, aliases as materialAliases } from '@/plugins/material-symbols.ts'

//  Vuetify Lab Components
import { VDateInput } from 'vuetify/labs/components'

// Composables
import { createVuetify } from 'vuetify'

import { md3 } from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    //  블루프린트
    blueprint: md3,
    //  컴포넌트
    components: {
        VDateInput,
    },
    //  아이콘세트
    icons: {
        defaultSet: 'materialSymbols',
        aliases: materialAliases,
        sets: { materialSymbols },
    },
    //  테마
    theme: {
        defaultTheme: 'dark',
        themes: {
            light: {
                dark: false,
                colors: {
                    default: '#000',
                    primary: '#D97706',
                    secondary: '#78350F',
                    surface: '#fff',
                    background: '#fff',
                    darken: '#7b7b7b',
                    'darken-2': '#b6b6b6',
                }
            },
            dark: {
                dark: true,
                colors: {
                    default: '#fff',
                    primary: '#FCD34D',
                    secondary: '#FEF3C7',
                    surface: '#282828',
                    background: '#0f0f0f',
                    darken: '#a2a2a2',
                    'darken-2': '#646464',
                }
            }
        }
    },
    //  컴포넌트 기본값 설정
    defaults: {
        VTextField: {
            color: "primary",
            hideDetails: "auto",
        },
        VBtn: {
            color: "primary",
            variant: "flat",
        },
        VSwitch: {
            color: "primary",
            hideDetails: "auto",
            flat: true
        },
        VCard: {
            elevation: 2,
        }
    }
})
