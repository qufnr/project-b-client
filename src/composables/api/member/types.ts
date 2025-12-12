//  사용자 정보
export type Member = {
    uid: number
    id: string
    name: string | null
    bio: string | null
    avatar: string | null
    banner: string | null
    lastSignedAt: string
    lastNameChangedDate: string | null
    birthday: string | null
    isLocked: boolean
    isEnabled: boolean
    privacy: MemberPrivacy
    authorities: string[]
}

//  프라이버시
export type MemberPrivacy = {
    isPublic: boolean
    isBirthdayPublic: boolean
}

//  사용자 생성 요청
export type MemberCreateRequest = {
    id: string
    name: string | null
    bio: string | null
    email: string
    password: string
    passwordConfirm: string
}

//  사용자 수정 요청
export type MemberUpdateRequest = {
    name: string
    bio: string | null
}
