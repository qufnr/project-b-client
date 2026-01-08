<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import type { Member } from '@/services/member/types.ts'

interface BMemberPrivacyModifyFormProps {
    member: Member
}

//  Props
const { member } = defineProps<BMemberPrivacyModifyFormProps>()

//  폼 참조
const privacyModifyForm = ref<VForm>()

const form = reactive({
    public: {
        value: true,
        rules: []
    },
    birthdayPublic: {
        value: true,
        rules: []
    }
})
</script>

<template>
    <v-form ref="privacyModifyForm" class="d-flex flex-column ga-3 mx-4" style="max-width: 660px">
        <div class="d-flex flex-column ga-1">
            <v-switch v-model="form.public.value" density="comfortable" label="프로필 공개" />
            <p class="text-caption">비공개로 설정하면 귀하만 프로필을 볼 수 있어요</p>
        </div>

        <div class="d-flex flex-column ga-1">
            <v-switch v-model="form.birthdayPublic.value" density="comfortable" label="생일 공개" />
            <p class="text-caption">비공개로 설정하면 다른 사용자는 귀하의 생일을 프로필에서 볼 수 없어요</p>
        </div>
    </v-form>
</template>

<style scoped>

</style>
