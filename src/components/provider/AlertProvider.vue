<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores/alert'
import { TimeUtils } from '@/utils/time'

//  Alert Store
const alertStore = useAlertStore()
const { visible, title, message, options } = storeToRefs(alertStore)

/**
 * Alert 닫히면 초기화
 */
async function onAlertClose() {
    //  트렌지션 때문에 진짜 조금있다가 초기화
    await TimeUtils.sleep(.1)

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
