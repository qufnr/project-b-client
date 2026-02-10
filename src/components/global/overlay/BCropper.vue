<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSnackbarStore } from '@/stores/snackbar'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const uploadImageType = import.meta.env.VITE_UPLOAD_IMAGE_EXTENSION

interface BCropperProps {
    maxWidth?: number | string
    aspectRatio?: number
    circleStencil?: boolean
    title?: string
    closeText?: string
    doneText?: string
    loading?: boolean
}

interface BCropperEmits {
    'click:done': [canvas: Blob, source: string]
}

//  I18n
const { t } = useI18n()

//  Snackbar Store
const snackbarStore = useSnackbarStore()

//  Model Value
const source = defineModel<string | null>({ required: false })

//  Props
const {
    maxWidth = 600,         //  다이얼로그 넓이
    aspectRatio = 1,        //  크롭 비율
    circleStencil = false,  //  원형 크롭 여부
    title = 'Crop Picture', //  다이얼로그 제목
    closeText = 'Close',    //  닫기 텍스트
    doneText = 'Done',      //  확인 텍스트
    loading = false,        //  로딩 여부
} = defineProps<BCropperProps>()

//  Emits
const emits = defineEmits<BCropperEmits>()

//  참조 변수
const visible = ref<boolean>(false)
const croppedSource = ref<string | null>(null)
const cropper = ref<any>()

//  source 변경 감지
watch(source, value => {
    visible.value = !!value
})

/**
 * 다이얼로그 닫힐 때 호출
 */
function onDialogClose() {
    if(source.value) {
        URL.revokeObjectURL(source.value)
        source.value = null
    }
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

            //  미리보기 이미지 이전에 있으면 메모리에서 초기화
            if(croppedSource.value)
                URL.revokeObjectURL(croppedSource.value)

            //  미리보기 이미지 생성
            croppedSource.value = URL.createObjectURL(blob)

            emits('click:done', blob, croppedSource.value)
        }, uploadImageType, .5)
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
        <v-card :loading="loading ? 'primary' : false">
            <!-- 제목 -->
            <v-card-title>{{ title }}</v-card-title>

            <!-- 내용 -->
            <v-card-text class="cropper-container">
                <Cropper ref="cropper"
                         class="cropper"
                         :src="source"
                         :stencil-props="{ aspectRatio }"
                         :stencil-component="circleStencil ? CircleStencil : undefined"
                         background-class="cropper-background"
                />
            </v-card-text>

            <!-- 엑션 -->
            <v-card-actions class="float-end">
                <v-btn variant="outlined" color="secondary" @click="onDialogClose" :disabled="loading">{{ closeText }}</v-btn>
                <v-btn variant="flat" @click="onDoneClick" :disabled="loading">{{ doneText }}</v-btn>
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
