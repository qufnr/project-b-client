//  API 응답 타입
export interface ApiResponse<T> {
    timestamp: string
    data: T
    status: string
    message?: string
}

//  토큰 리프레시 구독 상태 타입
export interface RefreshStatus {
    pending: boolean
    subscribers: { callback: (value: string) => any }[]
}

//  오류 응답 (Axios 인스턴스에서 사용)
export interface ClientErrorResponse {
    error: any
    message: string
}
