<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { type RuleFunction, Validation } from '@/utils/validation'
import type { VForm } from 'vuetify/components'

interface InputValue {
    value: string
    rules: RuleFunction[]
}

//  상태 변수 타입
interface SignUpViewState {
    step: number
    id: InputValue
    email: InputValue
    password: InputValue
    passwordConfirm: InputValue
}

//  화면 반응형 설정 타입
interface NativeOption {
    cols: number
    card: {
        width?: string | number
        height?: string | number
        color?: string
        flat: boolean
    }
}

//  Vue I18n
const { t } = useI18n()

//  Vuetify
const { smAndDown } = useDisplay()

//  기본 정보 입력 폼
const accountForm = ref<VForm>()
//  비밀번호 입력 폼
const passwordForm = ref<VForm>()

//  상태 변수
const state = reactive<SignUpViewState>({
    step: 0,
    id: {
        value: '',
        rules: [
            Validation.required,
            v => Validation.minLength(v, 4),
            v => Validation.maxLength(v, 20)
        ]
    },
    email: {
        value: '',
        rules: [
            Validation.required,
            Validation.email,
            v => Validation.maxLength(v, 60)
        ]
    },
    password: {
        value: '',
        rules: [
            Validation.required,
        ]
    },
    passwordConfirm: {
        value: '',
        rules: [
            Validation.required,
            v => Validation.sameAs(v, () => state.password.value, 'message.validation.passwordConfirmMismatch')
        ]
    }
})

//  화면 반응형
const nativeOptions = computed<NativeOption>(() => ({
    cols: smAndDown.value ? 12 : 6,
    card: {
        width: smAndDown.value ? '100%' : 720,
        height: smAndDown.value ? '100%' : 320,
        color: smAndDown.value ? 'background' : undefined,
        flat: smAndDown.value
    }
}))

//  카드 부제목
const subtitle = computed<string>(() => {
    switch(state.step) {
        case 0: return t('message.member.enterAccountAndEmail')
        case 1: return t('message.member.enterPassword')
        default:    return ''
    }
})

/**
 * 계정 아이디, 이메일 입력 후 다음 클릭
 */
async function onAccountAndEmailSubmit() {
    if(!accountForm.value)
        return

    const { valid } = await accountForm.value.validate()
    if(!valid)
        return

    state.step ++
}

/**
 * 계정 비밀번호 입력 후 다음 클릭
 */
async function onAccountPasswordSubmit() {
    if(!passwordForm.value)
        return

    const { valid } = await passwordForm.value.validate()
    if(!valid)
        return

    //  TODO :: 계정 생성
}
</script>

<template>
    <div class="d-flex justify-center align-center h-100">
        <v-card :width="nativeOptions.card.width"
                :height="nativeOptions.card.height"
                :color="nativeOptions.card.color"
                :flat="nativeOptions.card.flat"
        >
            <v-row class="ma-4">
                <v-col :cols="nativeOptions.cols" class="d-flex flex-column ga-2">
                    <p class="text-h5 font-weight-bold">{{ t('text.signUp') }}</p>
                    <p class="fs-n2">{{ subtitle }}</p>
                </v-col>
                <v-col :cols="nativeOptions.cols">
                    <v-window v-model="state.step">
                        <!-- 계정 아이디, 이메일 입력 -->
                        <v-window-item :value="0" class="mt-2">
                            <v-form ref="accountForm">
                                <v-text-field v-model="state.id.value"
                                              :label="t('text.member.memberAccount')"
                                              :rules="state.id.rules"
                                />
                                <v-spacer class="my-2" />
                                <v-text-field v-model="state.email.value"
                                              :label="t('text.member.memberEmail')"
                                              :rules="state.email.rules"
                                />
                                <p class="text-caption">{{ t('message.member.registerNotice') }}</p>
                                <v-spacer class="my-4" />
                                <div class="text-end">
                                    <v-btn @click="onAccountAndEmailSubmit">{{ t('text.next') }}</v-btn>
                                </div>
                            </v-form>
                        </v-window-item>

                        <!-- 비밀번호 입력 -->
                        <v-window-item :value="1" class="mt-2">
                            <v-form ref="passwordForm">
                                <v-text-field v-model="state.password.value"
                                              :label="t('text.memberPassword')"
                                              :rules="state.password.rules"
                                              type="password"
                                />
                                <v-spacer class="my-2" />
                                <v-text-field v-model="state.passwordConfirm.value"
                                              :label="t('text.memberPasswordConfirm')"
                                              :rules="state.passwordConfirm.rules"
                                              type="password"
                                />
                                <v-spacer class="my-4" />
                                <div class="text-end">
                                    <v-btn @click="onAccountPasswordSubmit">{{ t('text.next') }}</v-btn>
                                </div>
                            </v-form>
                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<style scoped>

</style>
