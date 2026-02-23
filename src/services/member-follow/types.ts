import type { Member } from '@/services/member/types.ts'

//  팔로우 상태
export interface MemberFollowStatus {
    followerCount: number
    followingCount: number
    isFollowingMe: boolean
    amIFollowing: boolean
}

//  팔로우 시 응답
export interface MemberFollowResponse {
    state: FollowState
    followee: Member
}

//  팔로우 응답에서의 팔로우 상태
export type FollowState = 'UNFOLLOW' | 'FOLLOW'
