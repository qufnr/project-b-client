<script setup lang="ts">
import { onMounted } from 'vue'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'

const localeStore = useLocaleStore()
const themeStore = useThemeStore()

onMounted(() => {
    localeStore.initialize()
    themeStore.initialize()
})
</script>

<template>

</template>

<style scoped>

</style>
