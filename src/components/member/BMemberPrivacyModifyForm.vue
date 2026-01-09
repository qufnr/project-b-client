<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { VForm } from 'vuetify/components'
import type { Member } from '@/services/member/types.ts'
import type { PublicState } from '@/services/global/types.ts'

interface BMemberPrivacyModifyFormProps {
    member: Member
}

interface BMemberPrivacyModifyFormState {
    profile: PublicState
    birthday: PublicState
    playlist: PublicState
}

//  Vue I18n
const { t } = useI18n()

//  Props
const { member } = defineProps<BMemberPrivacyModifyFormProps>()

//  폼 참조
const privacyModifyForm = ref<VForm>()

const form = reactive<BMemberPrivacyModifyFormState>({
    profile: 'PUBLIC',
    birthday: 'PUBLIC',
    playlist: 'PUBLIC',
})

//  공개 여부 라디오 값
const publicStates = computed(() => ([
    { label: t('text.publicState.public'), value: 'PUBLIC' },
    { label: t('text.publicState.followOnly'), value: 'FOLLOW_ONLY' },
    { label: t('text.publicState.private'), value: 'PRIVATE' },
]))
</script>

<template>
<!--    TODO :: 캡션 문구 바꾸기 -->
    <v-form ref="privacyModifyForm" class="d-flex flex-column ga-3 mx-4" style="max-width: 660px">
        <div class="d-flex flex-column ga-1">
            <p class="font-weight-bold">{{ t('text.member.profilePublic') }}</p>
<!--            <p class="text-caption">{{ t('message.member.caption.privacyProfile') }}</p>-->
            <v-radio-group v-model="form.profile" density="comfortable" inline>
                <v-radio v-for="(publicState, i) in publicStates" :key="i" :label="publicState.label" :value="publicState.value" class="mr-2" />
            </v-radio-group>
        </div>

        <div class="d-flex flex-column ga-1">
            <p class="font-weight-bold">{{ t('text.member.birthdayPublic') }}</p>
<!--            <p class="text-caption">{{ t('message.member.caption.privacyBirthday') }}</p>-->
            <v-radio-group v-model="form.birthday" density="comfortable" inline>
                <v-radio v-for="(publicState, i) in publicStates" :key="i" :label="publicState.label" :value="publicState.value" class="mr-2" />
            </v-radio-group>
        </div>

        <div class="d-flex flex-column ga-1">
            <p class="font-weight-bold">{{ t('text.member.playlistPublic') }}</p>
<!--            <p class="text-caption">{{ t('message.member.caption.privacyPlaylist') }}</p>-->
            <v-radio-group v-model="form.playlist" density="comfortable" inline>
                <v-radio v-for="(publicState, i) in publicStates" :key="i" :label="publicState.label" :value="publicState.value" class="mr-2" />
            </v-radio-group>
        </div>
    </v-form>
</template>

<style scoped>

</style>
