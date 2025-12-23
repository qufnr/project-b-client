import { ref } from 'vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { httpRequest } from '@/http'
import type { RequestConfigurer } from '@/http/types.ts'

export const useHttpRequest = <T>() => {
    const data = ref<T | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<unknown>(null)

    const snackbar = useSnackbarStore()

    const execute = async (configurer: RequestConfigurer) => {
        const method = configurer.method
        const endpoint = configurer.endpoint

        if(!method || !['GET', 'POST', 'PUT', 'DELETE'].includes(method))
            throw new Error('Invalid HTTP Method.')

        try {
            loading.value = true
            data.value = await httpRequest(configurer)
            return data.value
        }
        catch(err: any) {
            error.value = error
            snackbar.show({ text: String(error) })
        }
        finally {
            loading.value = false
        }
    }

    return {
        data,
        error,
        loading,
        execute
    }
}
