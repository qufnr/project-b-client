<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { VForm } from 'vuetify/components'
import { Validation, type RuleFunction } from '@/utilities/validation'

type SignViewState = { tap: number, id: InputValue, password: InputValue }
type InputValue = { value: string, loading: boolean, rules: RuleFunction[] }

//  Vue I18n
const { t } = useI18n()

//  계정 입력 폼 참조 객체
const inputIdForm = ref<VForm>()

//  계정 비밀번호 입력 폼 참조 객체
const inputPasswordForm = ref<VForm>()

//  상태 변수
const state = reactive<SignViewState>({
    //  입력 탭 인덱스
    tap: 0,
    //  계정 ID
    id: {
        value: '',
        loading: false,
        rules: [
            Validation.required,
        ]
    },
    //  계정 비밀번호
    password: {
        value: '',
        loading: false,
        rules: [
            Validation.required,
        ]
    },
})

/**
 * 다음, 로그인 눌렀을 때 호출
 */
async function onNextClick() {
    switch(state.tap) {
        case 0: {
            if(!inputIdForm.value)
                return

            try {
                state.id.loading = true

                const { valid } = await inputIdForm.value.validate()
                if(!valid)
                    return

                await new Promise(r => setTimeout(r, 1000))

                state.tap ++
            }
            finally {
                state.id.loading = false
            }

            break
        }

        case 1: {
            break
        }
    }
}
</script>

<template>
    <div class="d-flex justify-center align-center h-100">
        <v-card class="w-50" :loading="state.id.loading || state.password.loading ? 'secondary' : false">
            <v-row class="ma-4">
                <v-col cols="6">
                    <p class="text-h5">{{ t('text.signIn') }}</p>
                </v-col>
                <v-col cols="6">
                    <v-window v-model="state.tap">
                        <v-window-item :value="0">
                            <v-form ref="inputIdForm" class="d-flex flex-column my-2">
                                <!-- 계정 입력 -->
                                <v-text-field v-model="state.id.value"
                                              variant="outlined"
                                              :label="t('message.member.placeholder.enterId')"
                                              :disabled="state.id.loading"
                                              :rules="state.id.rules"
                                />
                                <!-- 계정, 비밀번호 찾기 -->
                                <router-link class="text-secondary text-decoration-none mt-2 fs-n2" :to="{ name: 'main' }">{{ t('text.findAccountOrPassword') }}</router-link>
                                <div class="text-end">
                                    <v-btn @click="onNextClick" :disabled="state.id.loading">{{ t('text.next') }}</v-btn>
                                </div>
                            </v-form>
                        </v-window-item>

                        <v-window-item :value="1">
                            <v-form ref="inputPasswordForm" class="d-flex flex-column my-2">
                                <!-- 비밀번호 입력 -->
                                <v-text-field v-model="state.password.value"
                                              variant="outlined"
                                              :label="t('message.member.placeholder.enterPassword')"
                                              :disabled="state.password.loading"
                                              :rules="state.password.rules"
                                />
                                <!-- 비밀번호 찾기 -->
                                <router-link class="text-secondary text-decoration-none mt-2 fs-n2" :to="{ name: 'main' }">{{ t('text.findPassword') }}</router-link>
                                <div class="text-end">
                                    <v-btn @click="onNextClick" :disabled="state.password.loading">{{ t('text.signIn') }}</v-btn>
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
