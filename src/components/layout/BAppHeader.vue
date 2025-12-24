<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import type { RouteItem } from '@/router/routes/types.ts'

//  I18n
const { t } = useI18n()

const { mobile } = useDisplay()

//  컴포넌트 프롭 타입
interface BAppHeaderProps {
    appName: string
    routes: RouteItem[]
    shortcutRoutes: RouteItem[]
}

//  State 타입
interface BAppHeaderState {
    drawer: {
        visible: boolean
        mobileVisible: boolean
        rail: boolean
    }
}

//  Props
const { appName, routes = [], shortcutRoutes = [] } = defineProps<BAppHeaderProps>()

//  States
const state = reactive<BAppHeaderState>({
    drawer: {
        visible: true,
        mobileVisible: false,
        rail: true,
    }
})

//  네비게이션 드로어 프롭값
const drawerProps = computed(() => {
    if(mobile.value)
        return state.drawer.visible
            ? { modelValue: true, rail: false, temporary: true }
            : { modelValue: false, rail: false, temporary: true }
    else
        return state.drawer.visible
            ? { modelValue: true, rail: false, temporary: false }
            : { modelValue: true, rail: true, temporary: false }
})

//  네비게이션 드로어 항목
const drawerItems = computed<RouteItem[]>(() => {
    if(drawerProps.value.rail)
        return shortcutRoutes
    else {
        return routes
    }
})

/**
 * 네비게이션 드로어 Model Value 감지 핸들
 *
 * @param value Model Value
 */
function handleDrawerUpdate(value: boolean) {
    state.drawer.visible = value
}
</script>

<template>
    <v-app-bar color="background">
        <v-app-bar-nav-icon @click="state.drawer.visible = !state.drawer.visible" />
        <v-app-bar-title>{{ appName }}</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-bind="drawerProps"
                         class="bg-background transition-none"
                         @update:model-value="handleDrawerUpdate"
                         disable-resize-watcher
                         floating
    >
        <v-list nav>
            <v-list-item v-for="(item, i) in drawerItems" :key="i"
                         :prepend-icon="item.icon"
            >
                <v-list-item-title>{{ t(item.name )}}</v-list-item-title>
                <v-list-item-subtitle>{{ t(item.name )}}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>

</style>
