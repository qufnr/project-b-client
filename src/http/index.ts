import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useCookies } from '@vueuse/integrations'
import router from '@/router'
import type { ApiResponse, RefreshStatus } from '@/http/types.ts'
import { StringUtils } from '@/utils/string'

//  API 주소
const appServerUrl: string = import.meta.env.VITE_APP_SERVER_URL

//  사용자 토큰 관련 쿠키 키값
const tokenCookieName: { sign: string, access: string, refresh: string } = {
    sign: import.meta.env.VITE_COOKIE_NAME_MEMBER_SIGN_TOKEN,
    access: import.meta.env.VITE_COOKIE_NAME_MEMBER_ACCESS_TOKEN,
    refresh: import.meta.env.VITE_COOKIE_NAME_MEMBER_REFRESH_TOKEN,
}

//  Authorization Headers
const authorizationHeaders: { sign: string, access: string, refresh: string } = {
    sign: import.meta.env.VITE_HTTP_HEADER_SIGN_AUTHORIZATION,
    access: import.meta.env.VITE_HTTP_HEADER_AUTHORIZATION,
    refresh: import.meta.env.VITE_HTTP_HEADER_REFRESH_AUTHORIZATION,
}

//  쿠키
const cookies = useCookies([tokenCookieName.sign, tokenCookieName.access, tokenCookieName.refresh])

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
            const signToken = cookies.get<string>(tokenCookieName.sign)
            configurer.headers[authorizationHeaders.sign] = StringUtils.hasText(signToken) ? `Bearer ${signToken}` : ''
            break

        case "member-management/signs/refresh":
            const refreshToken = cookies.get<string>(tokenCookieName.refresh)
            configurer.headers[authorizationHeaders.refresh] = StringUtils.hasText(refreshToken) ? `Bearer ${refreshToken}` : ''
            break

        default:
            const accessToken = cookies.get<string>(tokenCookieName.access)
            configurer.headers[authorizationHeaders.access] = StringUtils.hasText(accessToken) ? `Bearer ${accessToken}` : ''
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

const onResponseRejected = async (error: any) => {
    console.error(error)

    //  본문 요청 구성 요소 메모리에 저장
    const originRequest = error.config

    //  타임아웃 체크
    if(error.code === 'ERR_NETWORK') {
        await router.push({ name: 'timeout' })
    }

    //  UNAUTHORIZED 일 경우
    if(error.response.status === 401 && !originRequest._retry) {
        //  본문 재요청 무한루프 방지
        originRequest._retry = true

        //  리프레시 중일 경우 현재 요청 구독 후 대기
        if(refresh.pending) {
            return new Promise(resolve => {
                refresh.subscribers.push({
                    callback: (token: string) => {
                        originRequest.headers[authorizationHeaders.access] = `Bearer ${token}`
                        resolve(instance(originRequest))
                    }
                })
            })
        }
        refresh.pending = false

        try {
            //  TODO :: 여기서 토큰 리프레시
            const response = {
                //  임시 응답...
                accessToken: '',
            }

            //  대기 중이던 구독 재요청 처리
            onRefreshed(response.accessToken)

            //  재요청을 위해 해더에 토큰 변경
            originRequest.headers[authorizationHeaders.access] = `Bearer ${response.accessToken}`

            return instance(originRequest)
        }
        catch(error) {
            console.error('토큰 재발급 실패', error)

            //  TODO :: 여기서 사용자 로그아웃 처리
            await router.push({ name: 'sign' })

            return Promise.reject({
                raw: error,
                message: 'Token sessions is expired! Please try again sign-in.'
            })
        }
        finally {
            refresh.pending = false
        }
    }

    return Promise.reject({
        raw: error,
        //  TODO :: 오류 메시지 파싱
        message: 'Error message here.'
    })
}

instance.interceptors.request.use(onRequestFulfilled, onRequestRejected)
instance.interceptors.response.use(onResponseFulfilled, onResponseRejected)

export default instance
