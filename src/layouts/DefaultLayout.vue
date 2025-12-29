<script setup lang="ts">
import routes from '@/router/routes/routes.json'
import shortcutRoutes from '@/router/routes/shortcut-routes.json'

//  헤더 프롭
const headerProps = {
    appName: import.meta.env.VITE_APP_NAME,
    routes,
    shortcutRoutes
}
</script>

<template>
    <v-layout>
        <!-- 해더 내용과 네비게이션 드로어 -->
        <b-app-header v-bind="headerProps" />

        <v-main class="bg-background transition-none" style="min-height: 100vh">
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>
    </v-layout>
</template>

<style scoped>

</style>
