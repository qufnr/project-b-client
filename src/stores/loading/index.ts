import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLoadingStore = defineStore('loading', () => {
    const { t } = useI18n()

    const loading = ref<boolean>(false)
    const message = ref<string>('')

    /**
     * 로딩 표시 토글
     *
     * @param l 표시 여부 (기본값: true)
     * @param m 메시지
     */
    const toggle = (l: boolean = true, m?: string) => {
        loading.value = l
        message.value = m ?? t('message.loading')
    }

    return { loading, toggle }
})
