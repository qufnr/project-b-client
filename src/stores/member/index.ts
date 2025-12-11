import { defineStore } from 'pinia'
import { ref } from 'vue'

type MemberPrincipal = {
    uid: number
    id: string
    name?: string
    bio?: string
    authorities: string[]
}

export const useMemberStore = defineStore('memberStore', () => {
    const member = ref<MemberPrincipal>({
        uid: -1,
        id: "",
        name: "",
        bio: "",
        authorities: []
    })


})
