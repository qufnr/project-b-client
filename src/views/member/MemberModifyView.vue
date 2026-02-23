<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import { useSnackbarStore } from '@/stores/snackbar'
import { useLoadingStore } from '@/stores/loading'
import { MemberService } from '@/services/member'
import { StringUtils } from '@/utils/string'
import BMemberModifyForm from '@/components/member/BMemberModifyForm.vue'
import BMemberPrivacyForm from '@/components/member/BMemberPrivacyForm.vue'
import type { MemberUpdateRequest } from '@/services/member/types.ts'
import type { MemberPrivacy } from '@/services/member-privacy/types.ts'

type MemberModifyForm = InstanceType<typeof BMemberModifyForm>
type MemberPrivacyForm = InstanceType<typeof BMemberPrivacyForm>

//  Vue I18n
const { t } = useI18n()

//  Member Store
const memberStore = useMemberStore()
const { member } = storeToRefs(memberStore)

//  Snackbar Store
const snackbarStore = useSnackbarStore()

//  Loading Store
const loadingStore = useLoadingStore()
const { loading } = storeToRefs(loadingStore)

//  폼 Ref
const memberModifyForm = ref<MemberModifyForm>()
const memberPrivacyForm = ref<MemberPrivacyForm>()

const tab = ref<number>(0)          //  탭 번호 (0 - 일반, 1 - 프라이버시)

/**
 * 아바타 변경 시 호출
 *
 * @param blob 블롭 파일 객체
 * @param source 미리보기 문자열
 */
async function onAvatarUpdate(blob?: Blob, source?: string) {
    try {
        loadingStore.toggle()

        //  아바타 수정
        if(blob instanceof Blob && typeof source === 'string') {
            await MemberService.resource({ type: 'AVATAR', isDelete: false }, blob)
            member.value.avatar = source
            memberModifyForm.value?.revokeAvatar()
        }

        //  아바타 삭제
        else {
            await MemberService.resource({ type: 'AVATAR', isDelete: true })
            member.value.avatar = null
        }

        snackbarStore.show({ text: t('message.updated') })
    }
    catch(error: any) {
        snackbarStore.show({ text: error.message ?? t('message.error') })
    }
    finally {
        loadingStore.toggle(false)
    }
}

/**
 * 사용자 수정 시 호출
 *
 * @param data 수정 데이터
 */
async function onModify(data: MemberUpdateRequest) {
    try {
        loadingStore.toggle()

        await MemberService.update(data)

        member.value.name = StringUtils.hasText(data.name) ? data.name : member.value.name
        member.value.bio = StringUtils.hasText(data.bio) ? data.bio : member.value.bio
        member.value.birthday = StringUtils.hasText(data.birthday) ? data.birthday : member.value.birthday

        snackbarStore.show({ text: t('message.updated') })
    }
    catch(error: any) {
        snackbarStore.show({ text: error.message ?? t('message.error') })
    }
    finally {
        loadingStore.toggle(false)
    }
}

/**
 * 사용자 프라이버시 수정 시 호출
 *
 * @param data 수정 데이터
 */
async function onPrivacyModify(data: MemberPrivacy) {
    try {
        loadingStore.toggle()

        //  TODO :: 프라이버시 업데이트 API 추가
    }
    finally {
        loadingStore.toggle(false)
    }
}

</script>

<template>
    <v-container fluid>
        <v-tabs v-model="tab" :disabled="loading">
            <v-tab :value="0">{{ t('text.profile') }}</v-tab>
            <v-tab :value="1">{{ t('text.privacy') }}</v-tab>
        </v-tabs>
        <v-divider class="pb-2" />

        <v-tabs-window v-model="tab" :transition-duration="0">
            <v-tabs-window-item :value="0">
                <b-member-modify-form ref="memberModifyForm"
                                      :member="member"
                                      :loading="loading"
                                      @crop-avatar="onAvatarUpdate"
                                      @delete-avatar="onAvatarUpdate"
                                      @modify="onModify"
                />
            </v-tabs-window-item>
            <v-tabs-window-item :value="1">
                <b-member-privacy-form ref="memberPrivacyForm"
                                       :loading="loading"
                                       :member="member"
                                       @modify="onPrivacyModify"
                />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-container>
</template>

<style scoped>

</style>
