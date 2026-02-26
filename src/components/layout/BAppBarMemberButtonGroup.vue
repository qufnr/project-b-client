<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import { useStomp } from '@/composables/stomp/useStomp.ts'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'
import avatarMenuItems from '@/services/member/avatar-menu-items.json'
import { TimeUtils } from '@/utils/time'
import { ObjectUtils } from '@/utils/object'
import type { Member, MemberAvatarMenuItem } from '@/services/member/types.ts'
import type { NotificationDetails } from '@/services/notification/types.ts'

interface BAppBarMemberProfileProps {
    member?: Member | null
    memberName?: string | null
}

//  Vue Router
const route = useRoute()

//  Vue I18n
const { t } = useI18n()

//  알림 소켓
const { connect, disconnect, isConnected, client, send, subscribe, messages } = useStomp<NotificationDetails>()

//  알림 스토어
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

//  테마 스토어
const themeStore = useThemeStore()
const { theme, usableThemes } = storeToRefs(themeStore)

//  로케일 스토어
const localeStore = useLocaleStore()
const { locale, usableLocales } = storeToRefs(localeStore)

//  Props
const { member = null, memberName = null } = defineProps<BAppBarMemberProfileProps>()

const avatarMenu = ref<boolean>(false)    //  아바타 메뉴 표시 여부
const avatarMenuIndex = ref<number>(0)    //  아바타 표시 메뉴 인덱스
const menuItems = ref<MemberAvatarMenuItem[][]>([]) //  메뉴 항목
const notificationMenu = ref<boolean>(false)    //  알림 메뉴

//  설정 언어, 테마가 바뀌면 메뉴 항목 이름이 바뀌어야 하기 때문에, watch 로 집중 감시!!
watch([locale, theme], () => {
    //  메뉴 항목 복사
    const clonedMenuItems: MemberAvatarMenuItem[][] = ObjectUtils.deepClone(avatarMenuItems)

    menuItems.value = clonedMenuItems.map((menuItem: MemberAvatarMenuItem[]) => {
        menuItem.forEach((item: MemberAvatarMenuItem) => {
            //  바꾸고 싶은 메뉴 이름
            if(item.name === 'text.displayLanguage')
                item.name = `${t('text.displayLanguage')}: ${t(`text.availableLangs.${locale.value}`)}`
            else if(item.name === 'text.theme')
                item.name = `${t('text.theme')}: ${t(`text.availableThemes.${theme.value}`)}`
            else
                item.name = t(item.name)
        })

        return menuItem
    })
}, {
    deep: true,
    immediate: true
})

//  라우트 페스가 바뀌면 메뉴 끄기
watch(() => route.fullPath, () => {
    avatarMenu.value = false
})

//  소켓 연결 완료 시 알림 구독
watch(isConnected, value => {
    if(!value)
        return

    if(member == null) {
        disconnect()
        return
    }

    //  연결 시 알림 큐 구독
    subscribe(`/queue/member/${member.uid}/notification`, payload => {
        //  payload 타입 추론 가능
        notificationStore.addNotification(payload)
    })
})

/**
 * 메뉴가 열리고 닫힐 때 이벤트
 *
 * @param value 메뉴 열림 여부
 */
async function onMenuDisplay(value: boolean) {
    //  메뉴가 닫히면 메뉴 인덱스 초기화
    if(!value) {
        //  Transition 문제로 0.1초 뒤에 메뉴 인덱스를 초기화한다.
        await TimeUtils.sleep(.1)
        avatarMenuIndex.value = 0
    }
}

/**
 * 메뉴 클릭
 *
 * @param item 클릭한 메뉴 항목
 */
function onMenuItemClick(item: MemberAvatarMenuItem) {
    //  서브 메뉴가 있는 항목일 경우 메뉴 인덱스 대입
    if(item.subMenuIndex != null && !item.disabled) {
        avatarMenuIndex.value = item.subMenuIndex
        return
    }
}

onMounted(() => {
    notificationStore.initialize()

    //  알림 소켓 연결
    connect({ authenticated: true })
})

onUnmounted(() => {
    //  마운트 해제 시 알림 소켓 연결 해제
    disconnect()
})
</script>

<template>
    <div v-if="member" class="d-flex ga-2">
        <!-- 알림 메뉴 -->
        <v-menu v-model="notificationMenu"
                location="left"
                min-width="400"
                min-height="600"
                transition="none"
                :close-on-content-click="false"
        >
            <!-- 알림 버튼 -->
            <template #activator="{ props: notificationMenuProps }">
                <v-btn icon="notifications"
                       variant="text"
                       density="comfortable"
                       color="default"
                       v-bind="notificationMenuProps"
                />
            </template>

            <!-- 알림 메뉴 -->
            <v-list class="mx-2">
                <div class="d-flex justify-start ga-2 pt-2 pb-2 px-4">
                    <p>Notification</p>
                </div>
                <v-divider />

                <!-- 알림 목록 -->
                <v-list-item v-for="(item, i) in notifications" :key="i">
                    <template #prepend>
                        <b-member-icon v-if="item.sender" :member="item.sender" />
                        <b-member-icon v-else system />
                    </template>
                    <v-list-item-title v-if="item.sender">{{ item.sender!.name ?? item.sender!.id }}</v-list-item-title>
                    <!-- TODO :: 상세한 내용으로 보여주기!! -->
                    <v-list-item-title v-else>{{ item.type }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
                </v-list-item>
                <!-- 알림 비어있을 때 -->
                <v-empty-state v-if="!notifications.length">
                    <template #text>{{ t('text.empty') }}</template>
                </v-empty-state>
            </v-list>
        </v-menu>

        <!-- 아바타 메뉴 -->
        <v-menu v-model="avatarMenu"
                location="left"
                min-width="300"
                transition="none"
                :close-on-content-click="false"
                @update:model-value="onMenuDisplay"
        >
            <template #activator="{ props: avatarMenuProps }">
                <b-member-icon :member="member" size="34" v-bind="avatarMenuProps" />
            </template>

            <!-- 아바타 메인 메뉴 -->
            <v-list v-if="avatarMenuIndex === 0" class="mx-2">
                <div class="d-flex justify-start ga-2 pt-2 pb-2 px-4">
                    <b-member-icon :member="member" size="38" />
                    <div>
                        <p>{{ memberName }}</p>
                        <p>{{ `@${member.id}` }}</p>
                        <v-spacer class="my-1" />
                        <router-link :to="{ name: 'member.modify' }" class="text-decoration-none text-secondary fs-n1">{{ t('text.modifyMyself') }}</router-link>
                    </div>
                </div>
                <v-divider class="my-2" />

                <template v-for="(menuItem, i) in menuItems" :key="i">
                    <v-list-item v-for="(item, x) in menuItem"
                                 :prepend-icon="item.icon"
                                 :append-icon="!!item.subMenuIndex ? 'keyboard_arrow_right' : undefined"
                                 :to="item.route && !item.disabled ? { name: item.route } : undefined"
                                 density="compact"
                                 :disabled="item.disabled"
                                 @click="onMenuItemClick(item)"
                    >
                        <v-list-item-title class="fs-n1">
                            {{ item.name }}
                        </v-list-item-title>
                    </v-list-item>

                    <v-divider v-if="menuItems.length !== (i + 1)" class="my-2" />
                </template>
            </v-list>

            <!-- Appearance Settings -->
            <v-list v-else-if="avatarMenuIndex === 1" class="ma-2">
                <div class="d-flex align-center px-2 ga-3">
                    <v-btn variant="text" density="comfortable" icon="arrow_back" @click="avatarMenuIndex = 0" color="default"></v-btn>
                    <p>{{ t('text.theme') }}</p>
                </div>
                <v-divider class="mt-1 mb-2" />

                <v-list-item density="compact"
                             prepend-icon=" "
                             :subtitle="t('message.themeApplyThisBrowser')">
                </v-list-item>

                <v-list-item v-for="(item, i) in usableThemes" :key="i"
                             density="compact"
                             :active="item.value === theme"
                             :prepend-icon="item.value === theme ? 'check' : ' '"
                             @click="themeStore.change(item.value)"
                >
                    <v-list-item-title class="fs-n1">
                        {{ t(item.name) }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>

            <!-- Locale Settings -->
            <v-list v-else-if="avatarMenuIndex === 2" class="ma-2">
                <div class="d-flex align-center px-2 ga-3">
                    <v-btn variant="text" density="comfortable" icon="arrow_back" @click="avatarMenuIndex = 0" color="default"></v-btn>
                    <p>{{ t('text.language') }}</p>
                </div>
                <v-divider class="mt-1 mb-2" />

                <v-list-item density="compact"
                             prepend-icon=" "
                             :subtitle="t('message.localeApplyThisBrowser')">
                </v-list-item>

                <v-list-item v-for="(item, i) in usableLocales" :key="i"
                             density="compact"
                             :active="item === locale"
                             :prepend-icon="item === locale ? 'check' : ' '"
                             @click="localeStore.change(item)"
                >
                    {{ t(`text.availableLangs.${item}`) }}
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
    <v-btn v-else icon="login" :to="{ name: 'sign' }">{{ t('text.signIn') }}</v-btn>
</template>

<style scoped>

</style>
