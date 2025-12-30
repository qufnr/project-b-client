<script setup lang="ts">
import { computed } from 'vue'

interface BPartyAvatarIconProps {
    party: any  //  TODO :: 파티 타입 선정
    size?: string | number
}

const { party, size = 32 } = defineProps<BPartyAvatarIconProps>()

const partyNameInitial = computed(() => party.name[0]?.toUpperCase())
</script>

<template>
    <v-avatar :color="party.colour" :image="party.icon ?? undefined" :size="size" class="select-none">
        <p>{{ partyNameInitial }}</p>
    </v-avatar>
</template>

<style scoped>

</style>
