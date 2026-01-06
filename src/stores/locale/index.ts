import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storageNames } from '@/construct.ts'

export const useLocaleStore = defineStore('locale', () => {
    const fallbackLocale = 'en-US'
    const { locale: language, availableLocales } = useI18n()

    //  현재 로케일
    const locale = computed<string>(() => language.value)

    //  존재하는 로케일
    const usableLocales = computed<string[]>(() => availableLocales)

    /**
     * 초기 설정 (프로바이더에서 호출)
     */
    const initialize = () => {
        const storedLocale = localStorage.getItem(storageNames.language)
        change(storedLocale ?? fallbackLocale)
    }

    /**
     * 로케일 변경
     *
     * @param name 로케일 이름
     */
    const change = (name: string) => {
        if(availableLocales.some(item => item === name))
            language.value = name
        else {
            console.error(`${name} 언어는 존재하지 않습니다.`)
            language.value = fallbackLocale
        }
        localStorage.setItem(storageNames.language, language.value)
    }

    return { change, initialize, locale, usableLocales }
})
