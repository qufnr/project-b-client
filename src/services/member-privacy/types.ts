//  사용자 정보 공개 여부
export interface MemberPrivacy {
    profile: PrivacyStatus
    birthday: PrivacyStatus
    feed: PrivacyStatus
}

export interface MemberPrivacyUpdateRequest {
    profile: PrivacyStatus
    birthday: PrivacyStatus
    feed: PrivacyStatus
}

//  공개 여부
export type PrivacyStatus = 'PUBLIC' | 'FOLLOW_ONLY' | 'PRIVATE'
