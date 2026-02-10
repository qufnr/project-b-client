<script setup lang="ts">
//  스넥바 프로바이더
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSnackbarStore } from '@/stores/snackbar'

const { t } = useI18n()

const snackbarStore = useSnackbarStore()
const { visible, colour, text, timeout, showCloseButton } = storeToRefs(snackbarStore)

</script>

<template>
    <v-snackbar v-model="visible" :color="colour" :timeout="timeout" location="bottom left">
        {{ text }}
        <template v-if="showCloseButton" #actions>
            <v-btn variant="text">{{ t('text.close') }}</v-btn>
        </template>
    </v-snackbar>
</template>

<style scoped>

</style>
