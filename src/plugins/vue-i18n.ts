import { createI18n } from 'vue-i18n'

//  Locales
import enUS from '@/locales/en-US.json'
import koKR from '@/locales/ko-KR.json'
import jaJP from '@/locales/ja-JP.json'

//  Vuetify Locales
import { ko, en, ja } from 'vuetify/locale'

type MessageSchema =
    typeof koKR & { $vuetify: typeof ko } |
        typeof enUS & { $vuetify: typeof en } |
        typeof jaJP & { $vuetify: typeof ja }

export const i18n = createI18n<[MessageSchema], 'ko-KR' | 'en-US' | 'ja-JP'>({
    legacy: false,
    locale: 'ko-KR',
    fallbackLocale: 'ko-KR',
    messages: {
        'ko-KR': { ...koKR, $vuetify: ko, },
        'en-US': { ...enUS, $vuetify: en, },
        'ja-JP': { ...koKR, $vuetify: ja, },    //  TODO :: 나중에 ja-JP 작업 되면 ...koKR 바꾸기
    }
})
