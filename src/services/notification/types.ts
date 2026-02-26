import type { ShortMember } from '@/services/member/types.ts'

//  알림 유형
export type NotificationType =
    'FOLLOW' |
    'FOLLOW_REQUEST' |
    'GUILD_MENTION' |
    'SYSTEM'

//  알림 조회 요청
export interface NotificationReadRequest {
    page: number
    size: number
    isRead?: boolean | null
    standardDate?: string | null
}

//  알림 수정 요청
export interface NotificationUpdateRequest {
    isRead: boolean
}

//  알림 삭제 요청 (일괄 삭제)
export interface NotificationDeleteRequest {
    uids?: number[]
    onlyRead: boolean
}

//  알림 응답
export interface NotificationDetails {
    uid: number
    receiver: ShortMember
    sender?: ShortMember | null
    message: string
    type: NotificationType
    isRead: boolean
    sentAt: string
}
