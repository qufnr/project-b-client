import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface AlertOptions {
    isDelete?: boolean
    showCancel?: boolean
    onConfirm?: () => void
    onCancel?: () => void
    onClose?: () => void
    confirmText?: string
    cancelText?: string
}

export const useAlertStore = defineStore('alert', () => {
    const { t } = useI18n()

    const visible = ref<boolean>(false)
    const title = ref<string>()
    const message = ref<string>()
    const options = ref<AlertOptions>({
        isDelete: false,
        showCancel: false,
        onConfirm: () => {},
        onCancel: () => {},
        cancelText: t('text.cancel'),
        confirmText: t('text.done'),
    })

    //  기본 옵션
    const defaultOptions: AlertOptions = {
        isDelete: false,
        showCancel: false,
        onConfirm: () => {},
        onCancel: () => {},
        cancelText: t('text.cancel'),
        confirmText: t('text.done'),
    }

    /**
     * Alert 표시
     * @param t 제목
     * @param m 메시지
     * @param opt 옵션
     */
    const show = (t: string, m: string, opt: AlertOptions = defaultOptions) => {
        visible.value = true
        title.value = t
        message.value = m
        options.value = { ...defaultOptions, ...opt }
    }

    return {
        visible, title, message, options, defaultOptions, show
    }
})
