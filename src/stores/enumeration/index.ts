import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { EnumerationService } from '@/services/enumeration/index.ts'
import type { EnumItem } from '@/services/enumeration/types.ts'

export const useEnumStore = defineStore('enum', () => {
    const enums = ref<Record<string, EnumItem[]>>()

    const isEnumsEmpty = computed(() => !enums.value || Object.keys(enums.value).length === 0)

    //  사용자 역할
    const memberRoles = computed(() => enums.value?.['MemberRole'] ?? [])
    //  사용자 기록 레벨
    const historyLevels = computed(() => enums.value?.['HistoryLevel'] ?? [])
    //  프라이버시 상태 유형
    const privacyStatuses = computed(() => enums.value?.['PrivacyStatus'] ?? [])

    /**
     * Enum 세팅
     */
    async function initialize() {
        enums.value = await EnumerationService.read()
    }

    return {
        initialize, enums,
        isEnumsEmpty,
        memberRoles,
        historyLevels,
        privacyStatuses,
    }
})
