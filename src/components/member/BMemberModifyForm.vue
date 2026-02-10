<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlertStore } from '@/stores/alert'
import { ObjectUtils } from '@/utils/object'
import { Validation } from '@/utils/validation'
import type { VForm } from 'vuetify/components'
import type { Member, MemberUpdateRequest } from '@/services/member/types.ts'
import type { ValidationRule } from 'vuetify'
import { StringUtils } from '@/utils/string'

interface BMemberModifyFormProps {
    member: Member
    loading?: boolean
}

interface BMemberModifyFormEmits {
    modify: [data: MemberUpdateRequest],
    cropAvatar: [blob: Blob, source: string],
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
    bio: {
        value: string
        rules: ValidationRule[]
    }
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
const {
    member,         //  사용자 정보
    loading = false //  로딩 여부
} = defineProps<BMemberModifyFormProps>()

//  Emits
const emits = defineEmits<BMemberModifyFormEmits>()

//  요소 참조 변수들
const modifyForm = ref<VForm>() //  입력 폼
const avatarFileInput = ref<HTMLInputElement>() //  아바타 파일 인풋

//  상태 변수들
const templateAvatar = ref<string | null>(null) //  업로드 아바타 파일

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
    bio: {
        value: '',
        rules: [
            v => Validation.maxLength(v, 500)
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
 * 아바타 변경 버튼 클릭
 */
function onAvatarChangeClick() {
    if(avatarFileInput.value)
        avatarFileInput.value.click()
}

/**
 * 아바타 파일 업로드 변경 이벤트
 *
 * @param event 이벤트
 */
function onTemplateAvatarChange(event: Event) {
    const target = event.target as HTMLInputElement

    if(target.files instanceof FileList && target.files[0] instanceof File) {
        if(templateAvatar.value)
            URL.revokeObjectURL(templateAvatar.value)

        templateAvatar.value = URL.createObjectURL(target.files[0])
    }
    else
        alertStore.show(t('text.member.avatarUploadFailed'), t('message.member.validation.invalidAvatarFile'), {
            confirmText: t('text.done')
        })

    target.value = ''
}

/**
 * 아바타 크롭
 *
 * @param blob 블롭 객체
 * @param source 미리보기 아바타
 */
async function onCropAvatar(blob: Blob, source: string) {
    emits('cropAvatar', blob, source)
}

/**
 * 수정 클릭
 */
async function onModifyClick() {
    if(!modifyForm.value || loading)
        return

    const { valid } = await modifyForm.value.validate()

    if(!valid)
        return

    emits('modify', {
        name: form.name.value,
        bio: form.bio.value,
        birthday: form.birthday.value
    })
}

/**
 * 초기화 클릭
 */
function onResetClick() {
    if(loading)
        return

    const target = {
        avatar: form.avatar.value,
        name: form.name.value,
        email: form.email.value,
        birthday: form.birthday.value,
    }

    if(ObjectUtils.hasDifference(member, target)) {
        alertStore.show(t('text.reset'), t('message.reset'), {
            showCancel: true,
            confirmText: t('text.reset'),
            onConfirm: () => {
                form.name.value = member.name ?? ''
                form.email.value = member.email
                form.avatar.value = member.avatar ?? ''
                form.birthday.value = member.birthday ?? ''
            }
        })
    }
}

onMounted(() => {
    form.avatar.value = member.avatar ?? ''
    form.name.value = member.name ?? ''
    form.bio.value = StringUtils.hasText(member.bio) ? StringUtils.htmlToTextarea(member.bio) : ''
    form.email.value = member.email
    form.birthday.value = member.birthday ?? ''
})

onUnmounted(() => {
    if(templateAvatar.value)
        URL.revokeObjectURL(templateAvatar.value)
})

defineExpose({
    formData: () => ObjectUtils.deepClone(member),

    revokeAvatar: () => {
        if(templateAvatar.value) {
            URL.revokeObjectURL(templateAvatar.value)
            templateAvatar.value = null
        }
    }
})
</script>

<template>
    <b-cropper v-model="templateAvatar"
               :title="t('text.member.avatarCrop')"
               :close-text="t('text.cancel')"
               :done-text="t('text.crop')"
               :loading="loading"
               @click:done="onCropAvatar"
    />
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
                    <v-btn :disabled="loading" @click="onAvatarChangeClick">{{ t('text.change')}}</v-btn>
                    <v-btn variant="outlined" color="secondary" :disabled="loading">{{ t('text.remove') }}</v-btn>
                </div>
            </div>
            <input type="file" ref="avatarFileInput" @change="onTemplateAvatarChange" class="d-none" />
        </div>

        <!-- Name (Alias) -->
        <div class="d-flex flex-column ga-1">
            <div>
                <p class="font-weight-bold">{{ t('text.member.memberName') }}</p>
                <p class="text-caption">{{ t('message.member.caption.changeName') }}</p>
            </div>
            <v-text-field v-model="form.name.value"
                          :rules="form.name.rules"
                          :disabled="loading"
                          width="100wh"
                          density="compact"
            />
        </div>

        <div class="d-flex flex-column ga-1">
            <div>
                <p class="font-weight-bold">{{ t('text.member.memberBio') }}</p>
                <p class="text-caption">{{ t('message.member.caption.bio') }}</p>
            </div>
            <v-textarea v-model="form.bio.value"
                        :rules="form.bio.rules"
                        :disabled="loading"
                        width="100wh"
                        rows="3"
                        no-resize
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
                          :disabled="!!member.birthday || loading"
                          :rules="form.birthday.rules"
                          transition="none"
                          density="compact"
                          prepend-icon=""
                          prepend-inner-icon="cake"
            />
        </div>

        <div class="d-flex justify-end ga-2">
            <v-btn variant="outlined" @click="onResetClick" :disabled="loading">{{ t('text.reset') }}</v-btn>
            <v-btn @click="onModifyClick" :disabled="loading">{{ t('text.modify') }}</v-btn>
        </div>
    </v-form>
    <v-spacer style="height: 250px" />
</template>

<style scoped>

</style>
