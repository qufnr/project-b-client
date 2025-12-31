<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import type { RouteItem } from '@/router/routes/types.ts'

interface BNavigationDrawerProps {
    shortcutItems?: RouteItem[]
    items: RouteItem[]
}

interface VNavigationDrawerNativeProps {
    modelValue: boolean
    rail: boolean
    temporary: boolean
}

//  Vue Router
const route = useRoute()

//  Vuetify Display
const { mobile } = useDisplay()
//  Vuetify Theme
const { current } = useTheme()

//  Vue I18n
const { t } = useI18n()

//  표시 여부
const draw = ref<boolean>(false)

//  Props
const { shortcutItems = [], items } = defineProps<BNavigationDrawerProps>()

//  VNavigationDrawer Native Props
const drawerProps = computed<VNavigationDrawerNativeProps>(() => {
    if(mobile.value)
        return {
            modelValue: draw.value,
            rail: false,
            temporary: true
        }
    else
        return {
            modelValue: !!shortcutItems.length ? true : draw.value,
            rail: !!shortcutItems.length ? !draw.value : false,
            temporary: false
        }
})

/**
 * 네비게이션 드로어 Model Value 감지 핸들
 *
 * @param value Model Value
 */
function handleDrawerUpdate(value: boolean) {
    draw.value = value
}

function isCurrentRoute(routeName: string | undefined) {
    return route.name === routeName
        ? current.value.dark ? 'bg-grey-darken-3' : 'bg-grey-lighten-3'
        : ''
}

defineExpose({
    toggle: () => draw.value = !draw.value
})
</script>

<template>
    <v-navigation-drawer v-bind="drawerProps"
                         class="transition-none bg-background"
                         @update:model-value="handleDrawerUpdate"
                         rail-width="70"
                         disable-resize-watcher
                         floating
    >
        <div v-if="drawerProps.rail" class="d-flex flex-column mt-1">
            <router-link v-for="(item, i) in shortcutItems" :key="i"
                         tag="div"
                         class="d-flex flex-column align-center justify-center rounded pa-1 ma-2 text-decoration-none text-default"
                         :class="[isCurrentRoute(item.route)]"
                         :to="{ name: item.route }"
                         v-ripple
            >
                <v-icon>{{ item.icon }}</v-icon>
                <p class="fs-n6 text-darken my-0">{{ t(item.name )}}</p>
            </router-link>
        </div>
        <v-list v-else nav>
            <v-list-item v-for="(item, i) in items" :key="i"
                         :prepend-icon="item.icon"
                         :to="{ name: item.route }"
            >
                <v-list-item-title>{{ t(item.name )}}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
</style>
