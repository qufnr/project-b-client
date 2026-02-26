import type { MemberFollowStatus } from '@/services/member-follow/types.ts'
import type { MemberPrivacy, MemberPrivacyUpdateRequest } from '@/services/member-privacy/types.ts'

//  사용자 정보
export interface Member {
    uid: number
    id: string
    email: string
    name?: string | null
    bio?: string | null
    colour: string
    avatar?: string | null
    banner?: string | null
    lastSignedAt: string
    lastNameChangedDate?: string | null
    birthday?: string | null
    isLocked: boolean
    isEnabled: boolean
    isVerified: boolean
    followStatus?: MemberFollowStatus
    privacy: MemberPrivacy
    authorities: string[]
}

export interface ShortMember {
    uid: number
    id: string
    name?: string | null
    avatar?: string | null
    colour: string
    authorities: string[]
}

//  사용자 아바타 메뉴 항목
export interface MemberAvatarMenuItem {
    icon: string
    name: string
    hasEvent: boolean
    disabled: boolean
    route?: string | null
    subMenuIndex?: number | null
}

//  사용자 생성 요청
export interface MemberCreateRequest {
    id: string
    name?: string
    bio?: string
    email: string
    password: string
    passwordConfirm: string
}

//  사용자 수정 요청
export interface MemberUpdateRequest {
    name?: string
    bio?: string
    birthday?: string
    privacy?: MemberPrivacyUpdateRequest
}

//  아이디, 이메일 사용 가능 여부 확인 요청
export interface MemberCanUseRequest {
    type: 'ID' | 'EMAIL'
    value: string
}

//  아이디, 이메일 사용 가능 여부 응답
export interface MemberCanUseResponse {
    canUse: boolean
}

//  리소스 업로드 요청
export interface MemberResourceRequest {
    type: 'AVATAR' | 'BANNER'
    isDelete: boolean
}
