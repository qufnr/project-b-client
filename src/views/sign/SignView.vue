<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useStorage } from '@vueuse/core'
import { useSignApi } from '@/composables/api/member-sign/useSignApi.ts'
import { useMemberStore } from '@/stores/member'
import { Validation, type RuleFunction } from '@/utils/validation'
import { cookieNames, storageNames } from '@/construct.ts'
import { StringUtils } from '@/utils/string'
import type { CookieChangeOptions } from 'universal-cookie'
import type { VForm } from 'vuetify/components'

type SignViewState = { tap: number, id: InputValue, password: InputValue }
type InputValue = { value: string, rules: RuleFunction[] }

//  Vue Router
const router = useRouter()

//  Vue I18n
const { t } = useI18n()

//  Vuetify
const { smAndDown } = useDisplay()

//  Vueuse Cookies
//  계정 ID 검증 토큰, 접근 토큰, 리프레시 토큰
const cookies = useCookies([cookieNames.token.sign, cookieNames.token.access, cookieNames.token.refresh])

//  Vueuse Storage (localStorage)
//  계정 ID 검증 완료 시 계정 이름 저장할 스토리지
const memberAlias = useStorage<string | null>(storageNames.signMemberAlias, null)

//  Member Store
const memberStore = useMemberStore()

//  Sign API Composable
const {
    fetchSign, signData, signLoading, signError,
    fetchAccess, data, loading, error
} = useSignApi()

//  계정 입력 폼 참조 객체
const inputIdForm = ref<VForm>()

//  계정 비밀번호 입력 폼 참조 객체
const inputPasswordForm = ref<VForm>()

//  상태 변수
const state = reactive<SignViewState>({
    //  입력 탭 인덱스
    //  0 - ID 입력, 1 - 비밀번호 입력, 2 - 로그인 만료, 3 - 이미 로그인된 상태
    tap: 0,
    //  계정 ID
    id: {
        value: '',
        rules: [
            Validation.required,
        ]
    },
    //  계정 비밀번호
    password: {
        value: '',
        rules: [
            Validation.required,
        ]
    },
})

//  카드 타이틀
const title = computed<string>(() => {
    switch(state.tap) {
        case 0: return t('text.signIn')
        case 1: return t('text.signEnterPassword')
        case 2: return t('text.signExpired')
        default: return ''
    }
})

/**
 * 다음, 로그인 눌렀을 때 호출
 */
async function onNextClick() {
    switch(state.tap) {
        //  ID 또는 이메일 입력
        case 0: {
            if(!inputIdForm.value)
                return

            const { valid } = await inputIdForm.value.validate()
            if(!valid)
                return

            await fetchSign(state.id.value)
            if(!!signData.value) {
                memberAlias.value = signData.value.name
                cookies.set(cookieNames.token.sign, signData.value.token, { expires: new Date(signData.value.expiration) })
            }

            state.tap ++

            break
        }

        //  비밀번호 입력
        case 1: {
            if(!inputPasswordForm.value)
                return

            const { valid } = await inputPasswordForm.value.validate()
            if(!valid)
                return

            await fetchAccess(state.password.value)
            if(!!data.value) {
                memberStore.updateByAccess(data.value)

                cookies.set(cookieNames.token.access, data.value.access, { expires: new Date(data.value.accessExpiration) })
                cookies.set(cookieNames.token.refresh, data.value.refresh, { expires: new Date(data.value.refreshExpiration) })

                router.push({ name: 'party' })
                    .then(() => { cookies.remove(cookieNames.token.sign) })
            }

            break
        }
    }
}

/**
 * 쿠키 변경 감지
 *
 * @param changeOptions 쿠키 변경 옵션
 */
const onCookieChange = (changeOptions: CookieChangeOptions) => {
    //  계정 ID 검증 토큰이 만료되었으면 2번 탭으로 이동
    if(changeOptions.name === cookieNames.token.sign && !changeOptions.value) {
        memberAlias.value = null
        state.tap = 2
    }
}

onMounted(() => {
    if(memberStore.isSigned) {
        state.tap = 3
    }
    //  계정 ID 검증 토큰이 존재하면 비밀번호 입력 탭으로 이동
    else if(!!cookies.get(cookieNames.token.sign) && StringUtils.hasText(memberAlias.value)) {
        state.tap = 1
    }
    else {
        cookies.remove(cookieNames.token.sign)
        cookies.remove(cookieNames.token.access)
        cookies.remove(cookieNames.token.refresh)
        memberAlias.value = null
    }

    //  쿠키 변경 감지 이벤트 등록
    cookies.addChangeListener(onCookieChange)
})

onUnmounted(() => {
    cookies.removeChangeListener(onCookieChange)
})
</script>

<template>
    <div class="d-flex justify-center align-center h-100">
        <v-card :width="smAndDown ? '100%' : 720"
                :height="smAndDown ? '100%' : 250"
                :loading="signLoading || loading ? 'secondary' : false"
                :color="smAndDown ? 'background' : undefined"
                :flat="smAndDown"
        >
            <v-row class="ma-4">
                <v-col :cols="smAndDown ? 12 : 6">
                    <p class="text-h5">{{ title }}</p>
                    <div v-if="state.tap === 1" class="fs-n1">
                        <p>{{ t('message.signWelcomeBackLine1', [memberAlias]) }}</p>
                        <p>{{ t('message.signWelcomeBackLine2') }}</p>
                    </div>
                </v-col>
                <v-col :cols="smAndDown ? 12 : 6">
                    <v-window v-model="state.tap" class="h-100">
                        <!-- 계정 입력 -->
                        <v-window-item :value="0">
                            <v-form ref="inputIdForm" class="d-flex flex-column my-2">
                                <v-text-field v-model="state.id.value"
                                              variant="outlined"
                                              :label="t('message.member.label.enterId')"
                                              :disabled="signLoading"
                                              :rules="state.id.rules"
                                              :error-messages="signError"
                                />
                                <!-- 계정, 비밀번호 찾기 -->
                                <router-link class="text-secondary text-decoration-none mt-2 fs-n2" :to="{ name: 'main' }">{{ t('text.findAccountOrPassword') }}</router-link>
                                <div class="text-end">
                                    <v-btn :to="{ name: 'sign-up' }" variant="text" class="mr-2">{{ t('text.signUp') }}</v-btn>
                                    <v-btn @click="onNextClick" :disabled="signLoading">{{ t('text.next') }}</v-btn>
                                </div>
                            </v-form>
                        </v-window-item>

                        <!-- 비밀번호 입력 -->
                        <v-window-item :value="1">
                            <v-form ref="inputPasswordForm" class="d-flex flex-column my-2">
                                <v-text-field v-model="state.password.value"
                                              variant="outlined"
                                              type="password"
                                              :label="t('message.member.label.enterPassword')"
                                              :disabled="loading"
                                              :rules="state.password.rules"
                                              :error-messages="error"
                                />
                                <!-- 비밀번호 찾기 -->
                                <router-link class="text-secondary text-decoration-none mt-2 fs-n2" :to="{ name: 'main' }">{{ t('text.findPassword') }}</router-link>
                                <div class="text-end">
                                    <v-btn @click="onNextClick" :disabled="loading">{{ t('text.signIn') }}</v-btn>
                                </div>
                            </v-form>
                        </v-window-item>

                        <!-- 로그인 시간 만료 -->
                        <v-window-item :value="2">
                            <p>{{ t('message.signExpired') }}</p>

                            <div class="text-end">
                                <v-btn>{{ t('text.signInRetry')}} </v-btn>
                            </div>
                        </v-window-item>

                        <!-- 로그인 세션 유효 -->
                        <v-window-item :value="3">

                        </v-window-item>
                    </v-window>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>

<style scoped>

</style>
