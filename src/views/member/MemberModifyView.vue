<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import BMemberModifyForm from '@/components/member/BMemberModifyForm.vue'
import BMemberPrivacyModifyForm from '@/components/member/BMemberPrivacyModifyForm.vue'

type MemberModifyForm = InstanceType<typeof BMemberModifyForm>
type MemberPrivacyModifyForm = InstanceType<typeof BMemberPrivacyModifyForm>

//  Vue I18n
const { t } = useI18n()

//  Member Store
const memberStore = useMemberStore()
const { member } = storeToRefs(memberStore)

//  폼 Ref
const memberModifyForm = ref<MemberModifyForm>()
const memberPrivacyModifyForm = ref<MemberPrivacyModifyForm>()

const tab = ref<number>(0)          //  탭 번호 (0 - 일반, 1 - 프라이버시)

</script>

<template>
    <v-container fluid>
        <v-tabs v-model="tab">
            <v-tab :value="0">{{ t('text.profile') }}</v-tab>
            <v-tab :value="1">{{ t('text.privacy') }}</v-tab>
        </v-tabs>
        <v-divider class="pb-2" />

        <v-tabs-window v-model="tab" :transition-duration="0">
            <v-tabs-window-item :value="0">
                <b-member-modify-form ref="memberModifyForm"
                                      :member="member"
                />
            </v-tabs-window-item>
            <v-tabs-window-item :value="1">
                <b-member-privacy-modify-form ref="memberPrivacyModifyForm"
                                              :member="member"
                />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-container>
</template>

<style scoped>

</style>
