<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDisplay, type ValidationRule } from 'vuetify'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useStorage } from '@vueuse/core'
import { useSnackbarStore } from '@/stores/snackbar'
import { useMemberStore } from '@/stores/member'
import { SignService } from '@/services/member-sign'
import { Validation } from '@/utils/validation'
import { cookieNames, storageNames } from '@/construct.ts'
import { StringUtils } from '@/utils/string'
import type { CookieChangeOptions } from 'universal-cookie'
import type { VForm } from 'vuetify/components'

//  상태 변수 타입
interface SignViewState {
    step: number
    loading: boolean
    id: InputValue
    password: InputValue
}
//  입력값 타입
interface InputValue {
    value: string
    rules: ValidationRule[]
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
const { member } = storeToRefs(memberStore)

//  Snackbar Store
const snackbarStore = useSnackbarStore()

//  계정 입력 폼 참조 객체
const inputIdForm = ref<VForm>()

//  계정 비밀번호 입력 폼 참조 객체
const inputPasswordForm = ref<VForm>()

//  상태 변수
const state = reactive<SignViewState>({
    //  입력 탭 인덱스
    //  0 - ID 입력, 1 - 비밀번호 입력, 2 - 로그인 만료, 3 - 이미 로그인된 상태
    step: 0,
    //  로딩 여부
    loading: false,
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
    switch(state.step) {
        case 0: return t('text.signIn')
        case 1: return t('text.signEnterPassword')
        case 2: return t('text.signExpired')
        case 3: return t('text.keepSigning')
        default: return ''
    }
})

//  화면 반응형
const nativeOptions = computed<NativeOption>(() => ({
    cols: smAndDown.value ? 12 : 6,
    card: {
        width: smAndDown.value ? '100%' : 720,
        height: smAndDown.value ? '100%' : 250,
        color: smAndDown.value ? 'background' : undefined,
        flat: smAndDown.value
    }
}))

/**
 * 다음, 로그인 눌렀을 때 호출
 */
async function onNextClick() {
    try {
        state.loading = true

        switch(state.step) {
            //  ID 또는 이메일 입력
            case 0: {
                if(!inputIdForm.value)
                    return

                const { valid } = await inputIdForm.value.validate()
                if(!valid)
                    return

                const response = await SignService.sign(state.id.value)
                memberAlias.value = response.name

                state.step ++

                break
            }

            //  비밀번호 입력
            case 1: {
                if(!inputPasswordForm.value)
                    return

                const { valid } = await inputPasswordForm.value.validate()
                if(!valid)
                    return

                const response = await SignService.access(state.password.value)
                memberStore.updateByAccess(response)

                await router.push({ name: 'party' })
                cookies.remove(cookieNames.token.sign)

                break
            }
        }
    }
    catch(error: any) {
        snackbarStore.show({ text: error.message })
    }
    finally {
        state.loading = false
    }
}

function onSignAnotherAccountClick() {
    cookies.remove(cookieNames.token.sign)
    memberAlias.value = null
    state.step = 0
}

/**
 * 로그아웃 클릭
 */
function onSignOutClick() {
    memberStore.clear()
    cookies.remove(cookieNames.token.access)
    cookies.remove(cookieNames.token.refresh)
    state.step = 0
}

/**
 * 쿠키 변경 감지
 *
 * @param changeOptions 쿠키 변경 옵션
 */
function onCookieChange(changeOptions: CookieChangeOptions) {
    //  계정 ID 검증 토큰이 만료되었으면 2번 탭으로 이동
    if(changeOptions.name === cookieNames.token.sign &&
        !changeOptions.value &&
        StringUtils.hasText(memberAlias.value)) {
        memberAlias.value = null
        state.step = 2
        snackbarStore.show({ text: t('message.signExpired'), timeout: 10000 })
    }
}

onMounted(() => {
    if(memberStore.isSigned) {
        state.step = 3
    }
    //  계정 ID 검증 토큰이 존재하면 비밀번호 입력 탭으로 이동
    else if(!!cookies.get(cookieNames.token.sign) && StringUtils.hasText(memberAlias.value)) {
        state.step = 1
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
    <v-app>
        <div class="d-flex justify-center align-center h-100">
            <v-card :width="nativeOptions.card.width"
                    :height="nativeOptions.card.height"
                    :loading="state.loading ? 'secondary' : false"
                    :color="nativeOptions.card.color"
                    :flat="nativeOptions.card.flat"
            >
                <v-row class="ma-4">
                    <v-col :cols="nativeOptions.cols" class="d-flex flex-column ga-2">
                        <p class="text-h5 font-weight-bold">{{ title }}</p>
                        <div v-if="state.step === 1" class="fs-n1">
                            <p>{{ t('message.signWelcomeBackLine1', [memberAlias]) }}</p>
                            <p>{{ t('message.signWelcomeBackLine2') }}</p>
                        </div>
                    </v-col>
                    <v-col :cols="nativeOptions.cols">
                        <v-window v-model="state.step" class="">
                            <!-- 계정 입력 -->
                            <v-window-item :value="0">
                                <v-form ref="inputIdForm" class="d-flex flex-column mt-2">
                                    <v-text-field v-model="state.id.value"
                                                  variant="outlined"
                                                  :label="t('text.member.memberAccountOrEmail')"
                                                  :disabled="state.loading"
                                                  :rules="state.id.rules"
                                    />
                                    <!-- 계정, 비밀번호 찾기 -->
                                    <router-link class="text-secondary text-decoration-none mt-2 fs-n2" :to="{ name: 'main' }">{{ t('text.findAccountOrPassword') }}</router-link>
                                    <v-spacer class="my-4" />
                                    <div class="text-end">
                                        <v-btn :to="{ name: 'sign-up' }" variant="text" color="secondary" class="mr-2">{{ t('text.signUp') }}</v-btn>
                                        <v-btn @click="onNextClick" :disabled="state.loading">{{ t('text.next') }}</v-btn>
                                    </div>
                                </v-form>
                            </v-window-item>

                            <!-- 비밀번호 입력 -->
                            <v-window-item :value="1">
                                <v-form ref="inputPasswordForm" class="d-flex flex-column my-2">
                                    <v-text-field v-model="state.password.value"
                                                  variant="outlined"
                                                  type="password"
                                                  :label="t('text.password')"
                                                  :disabled="state.loading"
                                                  :rules="state.password.rules"
                                    />
                                    <!-- 비밀번호 찾기 -->
                                    <router-link class="text-secondary text-decoration-none mt-2 fs-n2" :to="{ name: 'main' }">{{ t('text.findPassword') }}</router-link>
                                    <v-spacer class="my-4" />
                                    <div class="text-end">
                                        <v-btn @click="onSignAnotherAccountClick" variant="text" class="mr-2">{{ t('text.signInRetryAnotherAccount') }}</v-btn>
                                        <v-btn @click="onNextClick" :disabled="state.loading">{{ t('text.signIn') }}</v-btn>
                                    </div>
                                </v-form>
                            </v-window-item>

                            <!-- 로그인 시간 만료 -->
                            <v-window-item :value="2">
                                <p>{{ t('message.signExpired') }}</p>
                                <v-spacer class="my-8" />
                                <div class="text-end">
                                    <v-btn @click="state.step = 0">{{ t('text.signInRetry')}}</v-btn>
                                </div>
                            </v-window-item>

                            <!-- 로그인 세션 유효 -->
                            <v-window-item :value="3">
                                <div>
                                    <p>{{ t('message.signSessionAvailable') }}</p>
                                    <v-chip rounded>
                                        <template #prepend>
                                            <b-member-avatar-icon :member="member" class="mr-1" />
                                        </template>
                                        <p>{{ member.name }}</p>
                                    </v-chip>
                                </div>
                                <v-spacer class="my-16" />
                                <div class="text-end">
                                    <v-btn :to="{ name: 'party' }" variant="text" color="secondary" class="mr-2">{{ t('text.keepSigning') }}</v-btn>
                                    <v-btn @click="onSignOutClick">{{ t('text.signOut') }}</v-btn>
                                </div>
                            </v-window-item>
                        </v-window>
                    </v-col>
                </v-row>
            </v-card>
        </div>
    </v-app>
</template>

<style scoped>

</style>
