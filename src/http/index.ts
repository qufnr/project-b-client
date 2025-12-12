import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import { useSignApi } from '@/composables/api/member-sign/useSignApi.ts'
import { cookieNames, allowedHeaders } from '@/construct.ts'
import { StringUtils } from '@/utils/string'
import type { ApiResponse, RefreshStatus } from '@/http/types.ts'

//  API 주소
const appServerUrl: string = import.meta.env.VITE_APP_SERVER_URL

//  쿠키
const cookies = useCookies([cookieNames.token.sign, cookieNames.token.access, cookieNames.token.refresh])

//  리프레시 상태 저장
const refresh: RefreshStatus = {
    pending: false,
    subscribers: [],
}

//  Axios 인스턴스
const instance = axios.create({
    baseURL: appServerUrl,
    timeout: 10000
})

/**
 * 리프레시 완료 시 큐에 쌓인 요청 호출
 *
 * @param token 토큰
 */
const onRefreshed = (token: string) => {
    refresh.subscribers.forEach(sub => sub.callback(token))
    refresh.subscribers = []
}

/**
 * 요청 성취
 *
 * @param configurer Axios 내부 요청 구성
 * @return Axios 내부 요청 구성
 */
const onRequestFulfilled = (configurer: InternalAxiosRequestConfig) => {
    //  Authorization 토큰 검증
    switch(configurer.url) {
        case "member-management/signs":
            const signToken = cookies.get<string>(cookieNames.token.sign)
            configurer.headers[allowedHeaders.signAuthorization] = StringUtils.hasText(signToken) ? `Bearer ${signToken}` : ''
            break

        case "member-management/signs/refresh":
            const refreshToken = cookies.get<string>(cookieNames.token.refresh)
            configurer.headers[allowedHeaders.refreshAuthorization] = StringUtils.hasText(refreshToken) ? `Bearer ${refreshToken}` : ''
            break

        default:
            const accessToken = cookies.get<string>(cookieNames.token.access)
            configurer.headers[allowedHeaders.authorization] = StringUtils.hasText(accessToken) ? `Bearer ${accessToken}` : ''
            break
    }

    return configurer
}

/**
 * 요청 거부
 *
 * @param error 오류 내용
 */
const onRequestRejected = (error: any) => Promise.reject(error)

/**
 * 응답 성취
 *
 * @param response Axios 응답
 * @return Axios 응답
 */
const onResponseFulfilled = (response: AxiosResponse) =>
    Promise.resolve<AxiosResponse<ApiResponse<any>>>(response)

/**
 * 응답 거부
 *
 * @param error Axios 오류 구성
 * @return 오류 메시지
 */
const onResponseRejected = async (error: any): Promise<string> => {
    console.log("error", error)
    console.error(error.stack)

    //  본문 요청 구성 요소 메모리에 저장
    const originRequest = error.config

    //  타임아웃 체크
    if(error.code === 'ERR_NETWORK') {
        try {
            await router.push({ name: 'timeout' })
        }
        catch(routeError) {
            console.error('라우트 이동 실패', routeError)
        }

        return Promise.reject('서버와 연결하는 데 실패했어요')
    }

    //  UNAUTHORIZED 일 경우 (접근 토큰 리프레시 처리)
    if(error.response.status === 401 && !originRequest._retry) {
        //  본문 재요청 무한루프 방지
        originRequest._retry = true

        //  리프레시 중일 경우 현재 요청 구독 후 대기
        if(refresh.pending) {
            return new Promise(resolve => {
                refresh.subscribers.push({
                    callback: (token: string) => {
                        originRequest.headers[allowedHeaders.authorization] = `Bearer ${token}`
                        resolve(instance(originRequest))
                    }
                })
            })
        }
        refresh.pending = false

        try {
            const memberStore = useMemberStore()
            const { member } = storeToRefs(memberStore)
            const { fetchRefresh } = useSignApi()

            const response = await fetchRefresh()
            member.value = response.member
            cookies.set(cookieNames.token.access, response.access, { expires: new Date(response.accessExpiration) })
            cookies.set(cookieNames.token.refresh, response.refresh, { expires: new Date(response.refreshExpiration) })

            //  대기 중이던 구독 재요청 처리
            onRefreshed(cookies.get(cookieNames.token.access))

            //  재요청을 위해 해더에 토큰 변경
            originRequest.headers[allowedHeaders.authorization] = `Bearer ${cookies.get(cookieNames.token.access)}`

            return instance(originRequest)
        }
        catch(error) {
            console.error('토큰 재발급 실패', error)

            const { clearMember } = useMemberStore()
            clearMember()
            cookies.remove(cookieNames.token.sign)
            cookies.remove(cookieNames.token.access)
            cookies.remove(cookieNames.token.refresh)

            await router.push({ name: 'sign' })

            return Promise.reject('Token sessions is expired! Please try again sign-in.')
        }
        finally {
            refresh.pending = false
        }
    }

    const response = error.response.data as ApiResponse<any>
    const message: string = StringUtils.hasText(response.message) ? response.message : error.message

    return Promise.reject(message)
}

instance.interceptors.request.use(onRequestFulfilled, onRequestRejected)
instance.interceptors.response.use(onResponseFulfilled, onResponseRejected)

export default instance
