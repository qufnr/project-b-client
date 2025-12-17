<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from '@/composables/api/member/types.ts'

interface BMemberAvatarIconProps {
    member: Member
    size?: number | string
}

const { member, size } = defineProps<BMemberAvatarIconProps>()

//  이름 이니셜
const nameInitial = computed<string>(() => {
    if(member == null)
        return ''

    return member.name != null
        ? member.name.charAt(0).toUpperCase()
        : member.id.charAt(0).toUpperCase()
})
</script>

<template>
    <v-avatar :color="member.colour" :size="size">
        <v-img v-if="member.avatar != null"
               :src="member.avatar"
        />
        <p>{{ nameInitial }}</p>
    </v-avatar>
</template>

<style scoped>

</style>
