<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores/alert'

//  Alert Store
const alertStore = useAlertStore()
const { visible, title, message, options } = storeToRefs(alertStore)

/**
 * Alert 닫히면 초기화
 */
function onAlertClose() {
    console.log('is alert close?')
    title.value = undefined
    message.value = undefined
    options.value = alertStore.defaultOptions
}
</script>

<template>
    <b-alert v-model="visible"
             :title="title"
             :message="message"
             :is-delete="options.isDelete"
             :show-cancel="options.showCancel"
             :confirm-text="options.confirmText"
             :cancel-text="options.cancelText"
             @confirm="options.onConfirm()"
             @cancel="options.onCancel()"
             @close="onAlertClose"
    />
</template>

<style scoped>

</style>
