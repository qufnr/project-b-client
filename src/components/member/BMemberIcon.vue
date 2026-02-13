<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from '@/services/member/types.ts'

interface BMemberAvatarIconProps {
    member: Member
    src?: string
    size?: number | string
}

//  Props
const { member, src, size } = defineProps<BMemberAvatarIconProps>()

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
</script>

<template>
    <v-avatar :color="member.avatar != null ? undefined : member.colour" :size="size" class="select-none">
        <v-img v-if="member.avatar != null" :src="`${serverStaticUrl}avatar/${member.avatar}`" />
        <v-img v-else-if="!!src" :src="src" />
        <p v-else :style="{ fontSize: nameInitialSize }">{{ nameInitial }}</p>
    </v-avatar>
</template>

<style scoped>

</style>
