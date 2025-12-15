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
    const fetchMember = async (uid: number): Promise<Member> =>
        get(endpoint, { uid })

    /**
     * 접근 토큰으로 본인 계정 조회
     *
     * @return API 응답
     */
    const fetchMemberSelf = async (): Promise<Member> =>
        get(endpoint)

    /**
     * 계정 생성
     *
     * @param request 생성 요청
     * @return API 응답
     */
    const fetchCreateMember = async (request: MemberCreateRequest): Promise<Member> =>
        post(endpoint, { request })

    /**
     * 계정 수정
     *
     * @param request 수정 요청
     */
    const fetchUpdateMember = async (request: MemberUpdateRequest) =>
        put(endpoint, { request })

    return {
        data,
        loading,
        error,
        fetchMember,
        fetchMemberSelf,
        fetchCreateMember,
        fetchUpdateMember,
    }
}
