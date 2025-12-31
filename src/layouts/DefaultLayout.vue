<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useDisplay } from 'vuetify'
import BNavigationDrawer from '@/components/layout/BNavigationDrawer.vue'
import routes from '@/router/routes/routes.json'
import shortcutRoutes from '@/router/routes/shortcut-routes.json'

type NavigationDrawer = InstanceType<typeof BNavigationDrawer>

//  Application name
const appName = import.meta.env.VITE_APP_NAME

//  Navigation Drawer Ref
const drawer = useTemplateRef<NavigationDrawer>('drawer')

const { lgAndDown } = useDisplay()

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
        <!-- 해더 내용과 네비게이션 드로어 -->
        <v-app-bar color="background" class="mx-2">
            <v-app-bar-nav-icon @click="onNavIconClick"></v-app-bar-nav-icon>
            <v-app-bar-title>{{ appName }}</v-app-bar-title>
        </v-app-bar>

        <b-navigation-drawer ref="drawer"
                             :items="routes"
                             :shortcut-items="shortcutRoutes"
        />

        <v-main class="bg-background transition-none" style="min-height: 100vh">
            <v-container :fluid="lgAndDown">
                <router-view />
            </v-container>
        </v-main>
    </v-layout>
</template>

<style scoped>

</style>
