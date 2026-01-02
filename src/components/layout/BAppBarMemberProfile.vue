<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { StringUtils } from '@/utils/string'
import avatarMenuItems from '@/services/member/avatar-menu-items.json'
import type { Member, MemberAvatarMenuItem } from '@/services/member/types.ts'

interface BAppBarMemberProfileProps {
    member?: Member | null
    memberName?: string | null
}

//  Vue I18n
const { t, locale, availableLocales } = useI18n()

//  Vuetify Theme
const { themes, global } = useTheme()

//  Props
const { member = null, memberName = null } = defineProps<BAppBarMemberProfileProps>()

//  메뉴 표시 여부
const menu = ref<boolean>(false)
//  표시 메뉴 이름
const menuIndex = ref<number>(0)
//  메뉴 항목
const menuItems = ref<MemberAvatarMenuItem[][]>([])

//  설정 언어, 테마가 바뀌면 메뉴 항목 이름이 바뀌어야 하기 때문에, watch 로 집중 감시!!
watch([locale, global.name], () => {
    menuItems.value = avatarMenuItems.map((menuItem: MemberAvatarMenuItem[]) => {
        menuItem.forEach((item: MemberAvatarMenuItem) => {
            //  바꾸고 싶은 메뉴 이름
            if(item.name === 'text.displayLanguage')
                item.name = `${t('text.displayLanguage')}: ${t(`text.availableLangs.${locale.value}`)}`
            if(item.name === 'text.theme')
                item.name = `${t('text.theme')}: ${t(`text.availableThemes.${global.name.value}`)}`
        })

        return menuItem
    })
}, {
    deep: true,
    immediate: true
})

/**
 * 메뉴가 열리고 닫힐 때 이벤트
 *
 * @param value 메뉴 열림 여부
 */
function onMenuDisplay(value: boolean) {
    if(!value) {
        menuIndex.value = 0
    }
}

/**
 * 메뉴 클릭
 *
 * @param item 클릭한 메뉴 항목
 */
function onMenuItemClick(item: MemberAvatarMenuItem) {
    if(item.subMenuIndex != null) {
        menuIndex.value = item.subMenuIndex
        return
    }
}

onMounted(() => {
})
</script>

<template>
    <v-menu v-if="member"
            v-model="menu"
            location="left"
            min-width="300"
            transition="none"
            :close-on-content-click="false"
            @update:model-value="onMenuDisplay"
    >
        <template #activator="{ props: vMenuProps }">
            <b-member-icon :member="member" size="34" v-bind="vMenuProps" />
        </template>

        <!-- 메인 메뉴 -->
        <v-list v-if="menuIndex === 0" class="ma-2">
            <div class="d-flex justify-start ga-2 pt-2 pb-2 px-4">
                <b-member-icon :member="member" size="38" />
                <div>
                    <p>{{ memberName }}</p>
                    <p>{{ `@${member.id}` }}</p>
                    <v-spacer class="my-1" />
                    <router-link :to="{ name: 'member.me' }" class="text-decoration-none text-secondary fs-n1">{{ t('text.modifyMyself') }}</router-link>
                </div>
            </div>
            <v-divider class="my-2" />

            <template v-for="(menuItem, i) in menuItems" :key="i">
                <v-list-item v-for="(item, x) in menuItem"
                             :prepend-icon="item.icon"
                             :append-icon="!!item.subMenuIndex ? 'keyboard_arrow_right' : undefined"
                             :to="item.route ? { name: item.route } : undefined"
                             density="compact"
                             @click="onMenuItemClick(item)"
                >
                    <v-list-item-title class="fs-n1">
                        {{ t(item.name) }}
                    </v-list-item-title>
                </v-list-item>

                <v-divider v-if="menuItems.length !== (i + 1)" class="my-2" />
            </template>
        </v-list>

        <!-- 테마 설정 메뉴 -->
        <v-list v-else-if="menuIndex === 1" class="ma-2">
            <div class="d-flex">
                <v-btn icon="arrow_back" color="default"></v-btn>
                <p>{{ t('text.theme') }}</p>
            </div>
        </v-list>
    </v-menu>
    <v-btn v-else icon="login" :to="{ name: 'sign' }"></v-btn>
</template>

<style scoped>

</style>
