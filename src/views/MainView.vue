<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const appName: string = import.meta.env.VITE_APP_NAME
</script>

<template>
    <v-app>
        <v-empty-state :headline="appName" :text="t('message.subtitle')" :title="t('message.title')">
            <template #actions>
                <div class="d-flex justify-space-between ga-4">
                    <v-btn class="text-capitalize" prepend-icon="play_arrow">{{ t('text.gettingStart') }}</v-btn>
                    <v-btn class="text-capitalize" prepend-icon="login" :to="{ name: 'sign' }">{{ t('text.signIn') }}</v-btn>
                </div>
            </template>
        </v-empty-state>
    </v-app>
</template>

<style scoped>

</style>
