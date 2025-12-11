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

// Composables
import { createVuetify } from 'vuetify'

import { md3 } from 'vuetify/blueprints'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
    //  블루프린트
    blueprint: md3,
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
                    primary: '#57a413',
                    secondary: '#3f8435',
                    surface: '#fff',
                    background: '#fff',
                }
            },
            dark: {
                dark: true,
                colors: {
                    primary: '#8be140',
                    secondary: '#50c440',
                    surface: '#282828',
                    background: '#0f0f0f',
                }
            }
        }
    },
    //  컴포넌트 기본값 설정
    defaults: {
        VTextField: {
            color: "primary",
        },
        VBtn: {
            color: "primary",
            variant: "flat",
        },
        VCard: {
            elevation: 2,
        }
    }
})
