import http from '@/http'
import { useCookies } from '@vueuse/integrations/useCookies'
import { cookieNames } from '@/construct.ts'
import type { SignDetails, AccessDetails } from '@/services/member-sign/types.ts'

const endpoint = 'member-management/signs'

export const SignService = {
    /**
     * 계정 아이디 로그인
     *
     * @param value 계정 아이디(또는 이메일)
     * @return 로그인 응답
     */
    sign: async (value: string): Promise<SignDetails> => {
        const response = (await http.post<SignDetails>(`${endpoint}/id`, { value })).data

        const cookies = useCookies([cookieNames.token.sign])
        cookies.set(cookieNames.token.sign, response.token, { expires: new Date(response.expiration) })

        return response
    },

    /**
     * 계정 로그인
     *
     * @param password 계정 비밀번호
     * @return 로그인 응답
     */
    access: async (password: string): Promise<AccessDetails> => {
        const response = (await http.post<AccessDetails>(endpoint, { password })).data

        const cookies = useCookies([cookieNames.token.access, cookieNames.token.refresh])
        cookies.set(cookieNames.token.access, response.access, { expires: new Date(response.accessExpiration) })
        cookies.set(cookieNames.token.refresh, response.refresh, { expires: new Date(response.refreshExpiration) })

        return response
    },

    /**
     * 계정 토큰 리프레시
     *
     * @return 로그인 응답
     */
    refresh: async (): Promise<AccessDetails> => {
        const response = (await http.post<AccessDetails>(`${endpoint}/refresh`)).data

        const cookies = useCookies([cookieNames.token.access, cookieNames.token.refresh])
        cookies.set(cookieNames.token.access, response.access, { expires: new Date(response.accessExpiration) })
        cookies.set(cookieNames.token.refresh, response.refresh, { expires: new Date(response.refreshExpiration) })

        return response
    }
}
