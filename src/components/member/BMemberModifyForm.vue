<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlertStore } from '@/stores/alert'
import { ObjectUtils } from '@/utils/object'
import { Validation } from '@/utils/validation'
import type { VForm } from 'vuetify/components'
import type { Member } from '@/services/member/types.ts'
import type { ValidationRule } from 'vuetify'

interface BMemberModifyFormProps {
    member: Member
}

interface BMemberModifyFormStates {
    avatar: {
        value: string
        rules: ValidationRule[]
    },
    name: {
        value: string
        rules: ValidationRule[]
    },
    email: {
        value: string
        rules: ValidationRule[]
    },
    birthday: {
        value: string
        rules: ValidationRule[]
    }
}

//  Vue I18n
const { t } = useI18n()

//  Alert Store
const alertStore = useAlertStore()

//  Props
const { member } = defineProps<BMemberModifyFormProps>()

//  폼 Ref
const modifyForm = ref<VForm>()

//  Form States
const form = reactive<BMemberModifyFormStates>({
    avatar: {
        value: '',
        rules: [],
    },
    name: {
        value: '',
        rules: [
            v => Validation.minLength(v, 2),
            v => Validation.maxLength(v, 12),
        ]
    },
    email: {
        value: '',
        rules: [
            Validation.email,
        ]
    },
    birthday: {
        value: '',
        rules: []
    }
})

/**
 * 수정 클릭
 */
async function onModifyClick() {
    if(!modifyForm.value)
        return

    const { valid } = await modifyForm.value.validate()

    if(!valid)
        return
}

/**
 * 초기화 클릭
 */
function onResetClick() {
    const target = {
        avatar: form.avatar.value,
        name: form.name.value,
        email: form.email.value,
        birthday: form.birthday.value,
    }

    if(ObjectUtils.hasDifference(member, target)) {
        alertStore.show(t('text.reset'), '변경된 내용이 있어요. 그래도 초기화할까요?', {
            showCancel: true,
            confirmText: t('text.reset'),
            onConfirm: () => {
                form.name.value = member.name
                form.email.value = member.email
                form.avatar.value = member.avatar
                form.birthday.value = member.birthday
            }
        })
    }
}

onMounted(() => {
    form.avatar.value = member.avatar
    form.name.value = member.name
    form.email.value = member.email
    form.birthday.value = member.birthday
})

defineExpose({
    formData: () => ObjectUtils.deepClone(member.value)
})
</script>

<template>
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
                    <b-member-icon :member="member" :src="form.avatar.value" size="132" />
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
            <v-text-field v-model="form.name.value"
                          :rules="form.name.rules"
                          width="100wh"
                          density="compact"
            />
        </div>

        <!-- Email -->
        <div class="d-flex flex-column ga-1">
            <div>
                <p class="font-weight-bold">{{ t('text.member.memberEmail') }}</p>
                <p class="text-caption">{{ t('message.member.caption.email') }}</p>
            </div>
            <v-text-field v-model="form.email.value"
                          width="100wh"
                          density="compact"
                          disabled
            />
        </div>

        <!-- Birthday -->
        <div class="d-flex flex-column ga-1">
            <div>
                <p class="font-weight-bold">{{ t('text.member.memberBirthday')}}</p>
                <p class="text-caption">{{ t('message.member.caption.birthday') }}</p>
            </div>
            <v-date-input v-model="form.birthday.value"
                          :disabled="!!member.birthday"
                          :rules="form.birthday.rules"
                          transition="none"
                          density="compact"
                          prepend-icon=""
                          prepend-inner-icon="cake"
            />
        </div>

        <div class="d-flex justify-end ga-2">
            <v-btn variant="outlined" @click="onResetClick">{{ t('text.reset') }}</v-btn>
            <v-btn @click="onModifyClick">{{ t('text.modify') }}</v-btn>
        </div>
    </v-form>
    <v-spacer style="height: 250px" />
</template>

<style scoped>

</style>
