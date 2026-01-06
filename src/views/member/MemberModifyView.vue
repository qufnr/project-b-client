<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import type { Member } from '@/services/member/types.ts'
import type { VForm } from 'vuetify/components'

//  Vue I18n
const { t } = useI18n()

//  Member Store
const memberStore = useMemberStore()
const { member: storedMember } = storeToRefs(memberStore)

//  폼 Ref
const modifyForm = ref<VForm>()

const loading = ref<boolean>(false) //  로딩 여부
const member = ref<Member>()                //  사용자 정보

onBeforeMount(() => {
    member.value = storedMember.value
})
</script>

<template>
    <v-container fluid>
        <v-form ref="modifyForm" class="d-flex flex-column ga-3" style="max-width: 660px">
            <!-- Avatar -->
            <div class="d-flex flex-column ga-1">
                <div>
                    <p class="font-weight-bold">{{ t('text.member.memberAvatar') }}</p>
                    <p class="text-caption">{{ t('message.member.caption.avatar')}}</p>
                    <p class="text-caption">{{ t('message.member.caption.avatarSize')}}</p>
                </div>
                <div class="d-flex ga-2 align-end">
                    <v-card color="surface" width="210" class="d-flex justify-center align-center" elevation="0" flat>
                        <b-member-icon :member="member" size="132" />
                    </v-card>
                    <div class="d-flex ga-2">
                        <v-btn>{{ t('text.change')}}</v-btn>
                        <v-btn variant="outlined" color="secondary">{{ t('text.remove') }}</v-btn>
                    </div>
                </div>
            </div>

            <!-- Name (Alias) -->
            <div class="d-flex flex-column ga-1">
                <div>
                    <p class="font-weight-bold">{{ t('text.member.memberName') }}</p>
                    <p class="text-caption">{{ t('message.member.caption.changeName') }}</p>
                </div>
                <v-text-field v-model="member.name" width="100wh" density="compact" />
            </div>

            <!-- Email -->
            <div class="d-flex flex-column ga-1">
                <div>
                    <p class="font-weight-bold">{{ t('text.member.memberEmail') }}</p>
                    <p class="text-caption">{{ t('message.member.caption.email') }}</p>
                </div>
                <v-text-field v-model="member.email" width="100wh" density="compact" disabled />
            </div>

            <!-- Birthday -->
            <div class="d-flex flex-column ga-1">
                <div>
                    <p class="font-weigt-bold">{{ t('text.member.memberBirthday')}}</p>
                    <p class="text-caption">{{ t('message.member.caption.birthday') }}</p>
                </div>
                <!-- TODO :: VDatePicker 사용하기 -->
            </div>
        </v-form>
    </v-container>
</template>

<style scoped>

</style>
