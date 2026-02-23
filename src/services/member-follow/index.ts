import http from '@/http'
import type { MemberFollowResponse } from '@/services/member-follow/types.ts'

export const MemberFollowService = {
    /**
     * 대상을 팔로우/언팔로우 합니다.
     *
     * @param uid 대상 UID
     * @return 응답
     */
    toggle: async (uid: number): Promise<MemberFollowResponse> =>
        (await http.post<MemberFollowResponse>(`member-management/follows/toggle/${uid}`)).data
}
