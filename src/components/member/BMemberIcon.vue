<script setup lang="ts">
import { computed } from 'vue'
import type { Member, ShortMember } from '@/services/member/types.ts'

interface BMemberAvatarIconProps {
    member?: Member | ShortMember
    src?: string
    size?: number | string
    system?: boolean
    colour?: string
}

//  Props
const { member, src, size, colour, system = false } = defineProps<BMemberAvatarIconProps>()

//  서버 정적 리소스 URL
const serverStaticUrl = import.meta.env.VITE_APP_SERVER_STATIC_URL

//  이름 이니셜
const nameInitial = computed<string>(() => {
    if(member == null)
        return ''

    return member.name != null
        ? member.name.charAt(0).toUpperCase()
        : member.id.charAt(0).toUpperCase()
})

//  이름 이니셜 크기
const nameInitialSize = computed(() => `${Number(size) / 2}px`)

//  Src
const avatarSrc = computed(() => {
    if(member != null && member.avatar != null)
        return member.avatar.startsWith('blob:') ?
            member.avatar :
            `${serverStaticUrl}avatar/${member.avatar}`

    return null
})

//  Colour
const avatarColour = computed(() => {
    if(member != null && member.avatar != null)
        return undefined

    if(member != null && member.avatar == null)
        return member.colour

    return colour
})
</script>

<template>
    <v-avatar :color="avatarColour" :size="size" class="select-none">
        <v-img v-if="avatarSrc != null" :src="avatarSrc" />
        <v-img v-else-if="!!src" :src="src" />
        <p v-else :style="{ fontSize: nameInitialSize }">{{ nameInitial }}</p>
    </v-avatar>
</template>

<style scoped>

</style>
