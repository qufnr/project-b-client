import type { Member } from '@/composables/api/member/types.ts'

//  ID 인증 로그인 응답
export interface SignDetails {
    id: string
    name: string | null
    token: string
    expiration: number
}

//  비밀번호 인증 로그인 응답
export interface AccessDetails {
    access: string
    accessExpiration: number
    refresh: string
    refreshExpiration: number
    member: Member
}
