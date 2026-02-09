<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSnackbarStore } from '@/stores/snackbar'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

interface BCropperProps {
    maxWidth?: number | string
    aspectRatio?: number
    title?: string
    closeText?: string
    doneText?: string
}

interface BCropperEmits {
    'click:done': [canvas: Blob]
}

//  I18n
const { t } = useI18n()

//  Snackbar Store
const snackbarStore = useSnackbarStore()

//  Model Value
const source = defineModel<string | null>({ required: false })

//  Props
const {
    maxWidth = 600,
    aspectRatio = 1,
    title = 'Crop Picture',
    closeText = 'Close',
    doneText = 'Done'
} = defineProps<BCropperProps>()

//  Emits
const emits = defineEmits<BCropperEmits>()

//  참조 변수
const visible = ref<boolean>(false)
const croppedSource = ref<string | null>(null)
const cropper = ref<any>()

//  source 변경 감지
watch(source, (value, oldValue) => {
    if(oldValue !== value)
        visible.value = true

    else if(value === null)
        visible.value = false
})

/**
 * 다이얼로그 닫힐 때 호출
 */
function onDialogClose() {
    source.value = null
}

/**
 * 확인 클릭
 */
function onDoneClick() {
    const { canvas } = cropper.value.getResult()
    if(canvas) {
        canvas.toBlob((blob: Blob | null) => {
            if(!blob) {
                snackbarStore.show({ text: t('message.fileError') })
                return
            }

            emits('click:done', blob)
        }, 'image/webp', .5)
    }
}
</script>

<template>
    <v-dialog v-model="visible"
              :max-width="maxWidth"
              transition="none"
              @close="onDialogClose"
              persistent
    >
        <v-card>
            <!-- 제목 -->
            <v-card-title>{{ title }}</v-card-title>

            <!-- 내용 -->
            <v-card-text class="cropper-container">
                <Cropper ref="cropper"
                         class="cropper"
                         :src="source"
                         :stencil-props="{ aspectRatio }"
                         :stencil-component="CircleStencil"
                         background-class="cropper-background"
                />
            </v-card-text>

            <!-- 엑션 -->
            <v-card-actions class="float-end">
                <v-btn variant="outlined" color="secondary" @click="onDialogClose">{{ closeText }}</v-btn>
                <v-btn variant="flat" @click="onDoneClick">{{ doneText }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped lang="scss">
.cropper-container {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cropper {
    height: 400px;
    width: 100%;
}

.border-preview {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 4px;
}

// vue-advanced-cropper 내부 스타일 커스텀 예시
:deep(.cropper-background) {
    background-color: #777;
}
</style>
