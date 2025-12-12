import { ref } from 'vue'
import type { AxiosResponse } from 'axios'
import http from '@/http/index.ts'
import type { ApiResponse } from '@/http/types.ts'

export const useFetch = <T>() => {
    const data = ref<T | null>(null)
    const loading = ref(false)
    const error = ref<any>(null)

    /**
     * Ref 변수 초기화
     */
    const initialize = () => {
        data.value = null
        loading.value = false
        error.value = null
    }

    /**
     * GET 요청
     *
     * @param endpoint 엔드포인트
     * @param params 매개변수
     * @return 응답 데이터
     */
    const fetchGet = async (endpoint: string, params?: any): Promise<T> => {
        initialize()
        loading.value = true

        try {
            const response = await http.get<ApiResponse<T>>(endpoint, { params })
            data.value = response.data.data
            return response.data.data
        }
        catch(err) {
            error.value = err
            throw err
        }
        finally {
            loading.value = false
        }
    }

    /**
     * POST 요청
     *
     * @param endpoint 엔드포인트
     * @param body 요청 바디
     * @return 응답 데이터
     */
    const fetchPost = async (endpoint: string, body?: any): Promise<T> => {
        initialize()
        loading.value = true

        try {
            const response = await http.post<ApiResponse<T>>(endpoint, body)
            data.value = response.data.data
            return response.data.data
        }
        catch(err) {
            error.value = err
            throw err
        }
        finally {
            loading.value = false
        }
    }

    /**
     * PUT 요청
     *
     * @param endpoint 엔드포인트
     * @param body 요청 바디
     */
    const fetchPut = async (endpoint: string, body?: any): Promise<void> => {
        initialize()
        loading.value = true

        try {
            await http.put<AxiosResponse<ApiResponse<T>>>(endpoint, body)
        }
        catch(err) {
            error.value = err
            throw err
        }
        finally {
            loading.value = false
        }
    }

    /**
     * DELETE 요청
     *
     * @param endpoint 엔드포인트
     * @param params 매개변수
     */
    const fetchDelete = async (endpoint: string, params?: any): Promise<void> => {
        initialize()
        loading.value = true

        try {
            await http.delete<AxiosResponse<ApiResponse<T>>>(endpoint, { params })
        }
        catch(err) {
            error.value = err
            throw err
        }
        finally {
            loading.value = false
        }
    }

    return {
        data, loading, error,
        get: fetchGet, post: fetchPost, delete: fetchDelete, put: fetchPut,
    }
}
