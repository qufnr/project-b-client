<script setup lang="ts">
import routes from '@/router/routes/routes.json'
import shortcutRoutes from '@/router/routes/shortcut-routes.json'

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

        <v-main class="bg-background">
            <v-container>
                <router-view />
            </v-container>
        </v-main>
    </v-layout>
</template>

<style scoped>

</style>
