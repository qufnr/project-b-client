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
const drawerProps = computed<{ modelValue: boolean, rail: boolean, temporary: boolean }>(() => {
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
                         class="transition-none bg-background"
                         @update:model-value="handleDrawerUpdate"
                         rail-width="55"
                         disable-resize-watcher
                         floating
    >
        <v-row v-if="drawerProps.rail" class="mt-1">
            <v-col cols="12" v-for="(item, i) in shortcutRoutes" :key="i" class="my-1 py-1">
                <div class="d-flex flex-column align-center justify-center rounded mx-1 py-1" v-ripple @click="console.log">
                    <v-icon>{{ item.icon }}</v-icon>
                    <p class="fs-n6 text-darken">{{ t(item.name) }}</p>
                </div>
            </v-col>
        </v-row>
        <v-list v-else nav>
            <v-list-item v-for="(item, i) in routes" :key="i"
                         :prepend-icon="item.icon"
                         :to="{ name: item.route }"
            >
                <v-list-item-title>{{ t(item.name )}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.nav-icon-width-on-rail { width: 60px; }
.nav-icon-width { width: 20px; }
</style>
