import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const defaultTimeout: number = 2000

interface SnackbarOptions {
    text: string
    timeout?: number
}

export const useSnackbarStore = defineStore('snackbar', () => {
    const { current } = useTheme()

    const visible = ref<boolean>(false)
    const text = ref<string>('')
    const colour = ref<string>('black')
    const timeout = ref<number>(defaultTimeout)

    const show = (options: SnackbarOptions) => {
        visible.value = true
        text.value = options.text
        colour.value = current.value.dark ? 'white' : 'black'
        timeout.value = options.timeout ?? defaultTimeout
    }

    const close = () => {
        visible.value = false
    }

    return {
        visible, text, colour, timeout,
        show, close
    }
})
