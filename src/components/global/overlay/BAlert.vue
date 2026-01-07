<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { StringUtils } from '@/utils/string'

interface BAlertProps {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    showCancel?: boolean
    isDelete?: boolean
    closeOnContentClick?: boolean
    propVisible?: boolean
}

interface BAlertEmits {
    confirm: []
    cancel: []
    close: []
}

//  Vue I18n
const { t } = useI18n()

//  Props
const {
    title,
    message,
    confirmText,
    cancelText,
    showCancel = false,
    isDelete = false,
    closeOnContentClick = false,
} = defineProps<BAlertProps>()

//  Emits
const emits = defineEmits<BAlertEmits>()

//  Model Value
const modelValue = defineModel<boolean>({ type: Boolean, default: false })

//  완성형 텍스트
const fallbackTexts = computed(() => ({
    title: StringUtils.hasText(title) ? title : t('text.alert'),
    message,
    confirmText: StringUtils.hasText(confirmText) ? confirmText : t('text.confirm'),
    cancelText: StringUtils.hasText(cancelText) ? cancelText : t('text.cancel'),
}))

watch(modelValue, value => {
    if(!value)
        emits('close')
})

/**
 * 취소 클릭 이벤트
 */
function onCancelClick() {
    emits('cancel')
    modelValue.value = false
}

/**
 * 확인 클릭 이벤트
 */
function onConfirmClick() {
    emits('confirm')
    modelValue.value = false
}
</script>

<template>
    <v-dialog v-model="modelValue"
              :close-on-content-click="closeOnContentClick"
              :transition="false"
              max-width="500"
              no-click-animation
    >
        <v-card elevation="0">
            <v-card-title>{{ fallbackTexts.title }}</v-card-title>
            <v-divider />
            <v-card-text>
                <slot>
                    {{ fallbackTexts.message }}
                </slot>
            </v-card-text>
            <v-card-actions class="float-end mx-2 mb-2">
                <slot name="actions">
                    <v-btn v-if="showCancel"
                           variant="outlined"
                           color="secondary"
                           @click.stop="onCancelClick"
                    >
                        {{ fallbackTexts.cancelText }}
                    </v-btn>
                    <v-btn variant="flat"
                           :color="isDelete ? 'error' : 'primary'"
                           @click="onConfirmClick"
                    >
                        {{ fallbackTexts.confirmText }}
                    </v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>

</style>
