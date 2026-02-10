import http from '@/http'
import type {
    Member,
    MemberCanUseRequest,
    MemberCanUseResponse,
    MemberCreateRequest,
    MemberResourceRequest,
    MemberUpdateRequest
} from '@/services/member/types.ts'

const endpoint = 'member-management/members'

export const MemberService = {
    /**
     * 계정 조회
     *
     * @param uid 계정 UID
     * @return 계정 정보
     */
    read: async (uid: number | null = null): Promise<Member> =>
        (await http.get<Member>(uid == null ? endpoint : `${endpoint}/${uid}`)).data,

    /**
     * 계정 생성
     *
     * @param body 계정 생성 요청 정보
     * @return 생성된 계정 정보
     */
    create: async (body: MemberCreateRequest): Promise<Member> =>
        (await http.post<Member>(endpoint, body)).data,

    /**
     * 계정 수정
     *
     * @param body 계정 수정 요청 정보
     */
    update: async (body: MemberUpdateRequest): Promise<void> => await http.put(endpoint, body),

    /**
     * 계정 ID 또는 이메일 사용 가능 여부 확인
     *
     * @param params 확인할 사용 가능한 값 요청 정보
     * @return 사용 가능 여부
     */
    canUse: async (params: MemberCanUseRequest): Promise<MemberCanUseResponse> =>
        (await http.get<MemberCanUseResponse>(`${endpoint}/can-use`, { params })).data,

    /**
     * 사용자 리소스(아바타, 배너) 업로드
     *
     * @param params 요청 정보
     * @param source 파일
     */
    resource: async (params: MemberResourceRequest, source: File | Blob | null = null): Promise<void> => {
        if(!params.isDelete && !source)
            throw new Error('Invalid file data.')

        const request = new Blob([JSON.stringify(params)], { type: 'application/json' })

        const formData = new FormData()
        formData.append('request', request)
        if(source)
            formData.append('file', source, `member-avatar-template.${import.meta.env.VITE_UPLOAD_IMAGE_EXTENSION_SHORT}`)

        await http.put(`${endpoint}/resource`, formData)
    }
}
