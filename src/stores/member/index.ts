import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { cookieNames } from '@/construct.ts'
import { StringUtils } from '@/utils/string'
import type { Member } from '@/services/member/types.ts'
import type { SignDetails, AccessDetails } from '@/services/member-sign/types.ts'

export const useMemberStore = defineStore('member', () => {
    //  서버 정적 리소스 URL
    const serverStaticUrl = import.meta.env.VITE_APP_SERVER_STATIC_URL

    const member = ref<Member>({
        authorities: [],
        avatar: null,
        banner: null,
        email: '',
        bio: null,
        colour: '',
        birthday: null,
        id: '',
        isEnabled: false,
        isLocked: false,
        isVerified: false,
        lastNameChangedDate: null,
        lastSignedAt: "",
        name: null,
        privacy: {
            isPublic: false,
            isBirthdayPublic: false,
        },
        uid: 0
    })

    //  토큰 쿠키
    const cookies = useCookies([cookieNames.token.sign, cookieNames.token.access, cookieNames.token.refresh])

    //  사용자 로그인 여부
    const isSigned = computed(() => !!member.value.uid && !!cookies.get(cookieNames.token.access))
    //  사용자 이름 반환
    const memberName = computed(() => StringUtils.hasText(member.value.name) ? member.value.name : member.value.id)
    //  사용자 아바타 URL
    const memberAvatar = computed(() => StringUtils.hasText(member.value.avatar) ? `${serverStaticUrl}avatar/${member.value.avatar}` : null)

    /**
     * 로그인(또는 리프레시) 시 member 상태 변수 업데이트
     *
     * @param response 로그인(또는 리프레시) 응답
     */
    const updateByAccess = (response: AccessDetails) => {
        member.value = response.member
    }

    /**
     * 사용자 정보 삭제 (로그아웃)
     */
    const clear = () => {
        member.value = {
            authorities: [],
            avatar: null,
            banner: null,
            email: '',
            bio: null,
            colour: '',
            birthday: null,
            id: '',
            isEnabled: false,
            isLocked: false,
            isVerified: false,
            lastNameChangedDate: null,
            lastSignedAt: "",
            name: null,
            privacy: {
                isPublic: false,
                isBirthdayPublic: false,
            },
            uid: 0
        }
    }

    return {
        member,
        isSigned, memberName, memberAvatar,
        clear, updateByAccess
    }
})
