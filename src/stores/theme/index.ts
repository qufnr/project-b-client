import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import themes from '@/services/theme/themes.json'
import { ObjectUtils } from '@/utils/object'
import { storageNames } from '@/construct.ts'
import type { Theme } from '@/services/theme/types.ts'

export const useThemeStore = defineStore('theme', () => {
    const { global, change: changeTheme } = useTheme()
    const defaultTheme = 'system'

    //  현재 적용된 테마
    const theme = computed<string>(() => global.name.value)

    //  존재하는 테마
    const usableThemes = computed<Theme[]>(() => ObjectUtils.deepClone(themes))

    /**
     * 초기 설정 (프로바이더에서 호출)
     */
    const initialize = () => {
        const storedTheme = localStorage.getItem(storageNames.theme)
        change(storedTheme ?? defaultTheme)
    }

    /**
     * 테마 변경
     *
     * @param name 테마 이름
     */
    const change = (name: string) => {
        if(usableThemes.value.some(item => item.value === name)) {
            changeTheme(name)
            localStorage.setItem(storageNames.theme, name)
        }
        else {
            console.error(`${name} 테마는 존재하지 않습니다.`)
            changeTheme(defaultTheme)
            localStorage.setItem(storageNames.theme, defaultTheme)
        }
    }

    return { defaultTheme, usableThemes, theme, initialize, change }
})
