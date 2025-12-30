<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useDisplay } from 'vuetify'

interface BScrollTextProps {
    value: string
    gap?: number | string
}

//  Vuetify Display
const { width, height } = useDisplay()

//  Props
const { value, gap = 20 } = defineProps<BScrollTextProps>()

//  Text DOM Refs
const text = ref<HTMLDivElement>()
const cloneText = ref<HTMLDivElement>()

watch([width, height, () => value], () => {
    calculateTextCount()
})

async function calculateTextCount() {
    await nextTick()

    if(!text.value || !cloneText.value) {
        console.error('[BScrollText] 텍스트 DOM 이 존재하지 않습니다.')
        return
    }

    const container = document.querySelector('.scroll-text')
    if(!container) {
        console.error('[BScrollText] 컨테이너 요소가 존재하지 않습니다.')
        return
    }

    const textGap = String(gap).replace('px', '') + 'px'
    const containerWidth = container.clientWidth

    text.value.innerHTML = ''
    cloneText.value.innerHTML = ''

    const span = document.createElement('span')
    span.innerText = value
    span.style.display = 'inline-block'
    span.style.paddingRight = textGap
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    document.body.appendChild(span)

    const textWidth = span.offsetWidth
    document.body.removeChild(span)

    let count = Math.floor(containerWidth / textWidth) + 1
    if(count < 1)
        count = 1

    let content = ''
    for(let i = 0; i < count; i ++)
        content += `<span style="padding-right: ${textGap}">${value}</span>`

    text.value.innerHTML = content
    cloneText.value.innerHTML = content
}

onMounted(() => {
    calculateTextCount()
})
</script>

<template>
    <div class="scroll-text">
        <div class="scroll-text__list">
            <div ref="text" class="scroll-text__list-text"></div>
            <div ref="cloneText" class="scroll-text__list-text__clone"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.scroll-text {
    width: 100%;
    overflow: hidden;
    $mask-gradient: linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%);
    -webkit-mask-image: $mask-gradient;
    mask-image: $mask-gradient;
    .scroll-text__list {
        display: flex;
        width: fit-content;
        animation: rolling 20s linear infinite;

        //&:hover {
        //    animation-play-state: paused;
        //}

        .scroll-text__list-text, .scroll-text__list-text__clone {
            display: flex;
            align-items: center;
            white-space: nowrap;
        }
    }
}

@keyframes rolling {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}
</style>
