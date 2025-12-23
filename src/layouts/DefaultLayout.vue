<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
    <v-layout>
        <v-navigation-drawer color="background">
            <v-list nav>
                <v-list-item title="nav drawer" link></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar :title="appName" color="background"></v-app-bar>

        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
    </v-layout>
</template>

<style scoped>

</style>
