/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
// import { setupLayouts } from 'virtual:generated-layouts'
// import { routes } from 'vue-router/auto-routes'

//  Modules
import { storeToRefs } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'
import { StringUtils } from '@/utils/string'
import { i18n } from '@/plugins/vue-i18n.ts'
import { cookieNames, storageNames } from '@/construct.ts'

//  Member Modules
import { useMemberStore } from '@/stores/member'
import { MemberService } from '@/services/member'

//  Layout Components
import DefaultLayout from '@/layouts/DefaultLayout.vue'

//  View Components
import MainView from '@/views/MainView.vue'
import SignView from '@/views/sign/SignView.vue'
import SignUpView from '@/views/sign/SignUpView.vue'
import PartyMainView from '@/views/party/PartyMainView.vue'

const { t } = i18n.global

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '', name: 'main', component: MainView },
        { path: '/sign', name: 'sign', component: SignView },
        { path: '/sign-up', name: 'sign-up', component: SignUpView },
        {
            path: '',
            component: DefaultLayout,
            children: [
                { path: '/party', name: 'party', component: PartyMainView }
            ]
        }
    ],
    // routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
    const cookies = useCookies([cookieNames.token.access, cookieNames.token.refresh])
    if(StringUtils.hasText(cookies.get(cookieNames.token.access))) {
        try {
            const memberStore = useMemberStore()
            const { member } = storeToRefs(memberStore)

            member.value = await MemberService.read()
            next()
        }
        catch(error: any) {
            localStorage.setItem(storageNames.signOutReason, error.message)
            next({ name: 'sign' })
        }
    }

    next()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if(err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if(localStorage.getItem('bserver:dynamic-reload')) {
            console.error('동적 가져오기 오류, 페이지를 새로고침해도 해결되지 않음', err)
        } else {
            console.log('동적 가져오기 오류를 해결하기 위해 페이지를 새로 고칩니다')
            localStorage.setItem('bserver:dynamic-reload', 'true')
            location.assign(to.fullPath)
        }
    } else {
        console.error(err)
    }
})

router.isReady().then(() => {
    localStorage.removeItem('bserver:dynamic-reload')
})

export default router
