import { createI18n } from 'vue-i18n'

//  Locales
import enUS from '@/locales/en-US.json'
import koKR from '@/locales/ko-KR.json'
import jaJP from '@/locales/ja-JP.json'

type MessageSchema = typeof koKR | typeof enUS | typeof jaJP

export const i18n = createI18n<[MessageSchema], 'ko-KR' | 'en-US' | 'ja-JP'>({
    locale: 'ko-KR',
    fallbackLocale: 'ko-KR',
    messages: {
        'ko-KR': koKR,
        'en-US': enUS,
        'ja-JP': jaJP,
    }
})
