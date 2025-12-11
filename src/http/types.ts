//  API 응답 타입
export type ApiResponse<T> = {
    timestamp: string
    data: T
    status: string
    message?: string
}

//  토큰 리프레시 구독 상태 타입
export type RefreshStatus = {
    pending: boolean
    subscribers: { callback: (value: string) => any }[]
}
