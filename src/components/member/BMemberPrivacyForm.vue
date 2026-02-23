<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEnumStore } from '@/stores/enumeration'
import type { VForm } from 'vuetify/components'
import type { Member } from '@/services/member/types.ts'
import type { MemberPrivacy } from '@/services/member-privacy/types.ts'

interface BMemberPrivacyFormProps {
    member: Member
    loading?: boolean
}

interface BMemberPrivacyFormEmits {
    modify: [MemberPrivacy]
}

//  Vue I18n
const { t } = useI18n()

//  Enum Store
const { privacyStatuses } = useEnumStore()

//  Props
const { member, loading = false } = defineProps<BMemberPrivacyFormProps>()

//  Emits
const emits = defineEmits<BMemberPrivacyFormEmits>()

//  폼 참조
const privacyModifyForm = ref<VForm>()

const form = reactive<MemberPrivacy>({
    profile: 'PUBLIC',
    birthday: 'PUBLIC',
    feed: 'PUBLIC',
})

onMounted(() => {
    form.profile = member.privacy.profile
    form.birthday = member.privacy.birthday
    form.feed = member.privacy.feed
})
</script>

<template>
    <v-form ref="privacyModifyForm" class="d-flex flex-column ga-3 mx-4" style="max-width: 660px">
        <div class="d-flex flex-column ga-1">
            <p class="font-weight-bold">{{ t('text.member.privacyProfile') }}</p>
            <p class="text-caption">{{ t('message.member.caption.privacyProfile') }}</p>
            <v-radio-group v-model="form.profile" density="comfortable" :disabled="loading" inline @change="emits('modify', form)">
                <v-radio v-for="(status, i) in privacyStatuses" :key="i" :label="status.localizedDescription" :value="status.code" class="mr-2" />
            </v-radio-group>
        </div>

        <div class="d-flex flex-column ga-1">
            <p class="font-weight-bold">{{ t('text.member.privacyBirthday') }}</p>
            <p class="text-caption">{{ t('message.member.caption.privacyBirthday') }}</p>
            <v-radio-group v-model="form.birthday" density="comfortable" :disabled="loading" inline @change="emits('modify', form)">
                <v-radio v-for="(status, i) in privacyStatuses" :key="i" :label="status.localizedDescription" :value="status.code" class="mr-2" />
            </v-radio-group>
        </div>

        <div class="d-flex flex-column ga-1">
            <p class="font-weight-bold">{{ t('text.member.privacyFeed') }}</p>
            <p class="text-caption">{{ t('message.member.caption.privacyFeed') }}</p>
            <v-radio-group v-model="form.feed" density="comfortable" :disabled="loading" inline @change="emits('modify', form)">
                <v-radio v-for="(status, i) in privacyStatuses" :key="i" :label="status.localizedDescription" :value="status.code" class="mr-2" />
            </v-radio-group>
        </div>
    </v-form>
</template>

<style scoped>

</style>
