<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from '@/services/member/types.ts'

interface BMemberAvatarIconProps {
    member: Member
    src?: string
    size?: number | string
}

const { member, src, size } = defineProps<BMemberAvatarIconProps>()

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
    <v-avatar :color="member.colour" :size="size" class="select-none">
        <v-img v-if="member.avatar != null" :src="member.avatar" />
        <v-img v-else-if="!!src" :src="src" />
        <p :style="{ fontSize: nameInitialSize }">{{ nameInitial }}</p>
    </v-avatar>
</template>

<style scoped>

</style>
