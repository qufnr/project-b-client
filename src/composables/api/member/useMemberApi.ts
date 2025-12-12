import { useFetch } from '@/composables/useFetch.ts'
import type { Member, MemberCreateRequest, MemberUpdateRequest } from '@/composables/api/member/types.ts'

const endpoint = 'member-management/members'

export const useMemberApi = () => {
    const {
        data,
        loading,
        error,
        get,
        post,
        put,
    } = useFetch<Member>()

    /**
     * 계정 조회
     *
     * @param uid 계정 UID
     * @return API 응답
     */
    const readMember = async (uid: number): Promise<Member> =>
        get(endpoint, { uid })

    /**
     * 계정 생성
     *
     * @param request 생성 요청
     * @return API 응답
     */
    const createMember = async (request: MemberCreateRequest): Promise<Member> =>
        post(endpoint, { request })

    /**
     * 계정 수정
     *
     * @param request 수정 요청
     */
    const updateMember = async (request: MemberUpdateRequest) =>
        put(endpoint, { request })

    return {
        data,
        loading,
        error,
        readMember,
        createMember,
        updateMember,
    }
}
