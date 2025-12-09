import { createI18n } from 'vue-i18n'

//  Locales
import enUS from '@/locales/en-US.json'
import koKR from '@/locales/ko-KR.json'
import jaJP from '@/locales/ja-JP.json'

type MessageSchema = typeof enUS

export const i18n = createI18n<[MessageSchema], 'en-US' | 'ko-KR' | 'ja-JP'>({
    locale: 'en-US',
    fallbackLocale: 'en-US',
    messages: {
        'en-US': enUS,
        'ko-KR': koKR,
        'ja-JP': jaJP,
    }
})
