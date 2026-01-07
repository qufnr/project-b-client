<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import BNavigationDrawer from '@/components/layout/BNavigationDrawer.vue'
import routes from '@/services/route/routes.json'
import shortcutRoutes from '@/services/route/shortcut-routes.json'

//  BNavigationDrawer Component Type
type NavigationDrawer = InstanceType<typeof BNavigationDrawer>

//  Application name
const appName = import.meta.env.VITE_APP_NAME

//  Member Store
const memberStore = useMemberStore()
const { member } = storeToRefs(memberStore)

//  Navigation Drawer Ref
const drawer = useTemplateRef<NavigationDrawer>('drawer')

/**
 * App Bar의 Nav Icon 클릭 이벤트
 */
function onNavIconClick() {
    if(!drawer.value)
        return

    drawer.value.toggle()
}
</script>

<template>
    <v-layout>
        <!-- 헤더 -->
        <v-app-bar color="transparent" class="app-bar__bg-blur pl-2 pr-4">
            <v-app-bar-nav-icon @click="onNavIconClick"></v-app-bar-nav-icon>
            <v-app-bar-title>
                <template #text>{{ appName }}</template>
            </v-app-bar-title>
            <b-app-bar-member-button-group :member="member" :member-name="memberStore.memberName" />
        </v-app-bar>

        <!-- 네비게이션 드로어 -->
        <b-navigation-drawer ref="drawer"
                             :items="routes"
                             :shortcut-items="shortcutRoutes"
        />

        <!-- 본문 -->
        <v-main class="bg-background transition-none" style="min-height: 100vh">
            <router-view />
        </v-main>
    </v-layout>
</template>

<style lang="scss" scoped>
.app-bar__bg-blur {
    backdrop-filter: blur(64px);
    -webkit-backdrop-filter: blur(64px);
}
</style>
