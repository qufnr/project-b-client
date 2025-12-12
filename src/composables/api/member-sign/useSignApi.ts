import { useFetch } from '@/composables/useFetch.ts'
import type { SignDetails, AccessDetails } from '@/composables/api/member-sign/types.ts'

const endpoint = 'member-management/signs'

export const useSignApi = () => {
    const { data: signData, loading: signLoading, error: signError, post: signPost, } =
        useFetch<SignDetails>()
    const { data: accessData, loading: accessLoading, error: accessError, post: accessPost, } =
        useFetch<AccessDetails>()
    const { data: refreshData, loading: refreshLoading, error: refreshError, post: refreshPost, } =
        useFetch<AccessDetails>()

    /**
     * 계정 ID 로그인
     *
     * @param value 계정 또는 이메일
     */
    const fetchSign = (value: string) => signPost(`${endpoint}/id`, { value })

    /**
     * 계정 비밀번호 로그인
     *
     * @param password 비밀번호
     */
    const fetchAccess = async (password: string) => await accessPost(endpoint, { password })

    /**
     * 계정 토큰 리프레시
     */
    const fetchRefresh = async () => await refreshPost(endpoint)

    return {
        signData, signLoading, signError, fetchSign,
        accessData, accessLoading, accessError, fetchAccess,
        refreshData, refreshLoading, refreshError, fetchRefresh,
    }
}
