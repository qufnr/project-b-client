import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSnackbarStore } from '@/stores/snackbar'
import { NotificationService } from '@/services/notification'
import type { PaginationRequest } from '@/http/types.ts'
import type { NotificationDeleteRequest, NotificationDetails } from '@/services/notification/types.ts'

export const useNotificationStore = defineStore('notification', () => {
    const snackbarStore = useSnackbarStore()

    //  알림 목록
    const notifications = ref<NotificationDetails[]>([])

    //  로딩 여부
    const isLoading = ref<boolean>(false)

    //  알림 목록 페이징
    const pagination = ref<PaginationRequest>({ page: 0, size: 10 })

    //  안읽은 알림 개수
    const unreadCount = computed(() => notifications.value.filter(item => !item.isRead).length)

    async function initialize() {
        isLoading.value = true
        try {
            const response = await NotificationService.read(pagination.value)
            notifications.value = response.items
            pagination.value.page ++
        }
        catch(error: any) {
            snackbarStore.show({ text: error.message })
        }
        finally {
            isLoading.value = false
        }
    }

    /**
     * 알림 추가
     *
     * @param item 알림 항목
     */
    function addNotification(item: NotificationDetails) {
        notifications.value.unshift(item)
    }

    /**
     * 알림 읽기 처리
     *
     * @param uid 알림 UID
     */
    async function markAsRead(uid: number) {
        const notification = notifications.value.find(item => item.uid === uid)
        if(notification) {
            notification.isRead = true
            try {
                await NotificationService.update(uid, { isRead: notification.isRead })
            }
            catch(error: any) {
                snackbarStore.show({ text: error.message })
            }
        }
    }

    /**
     * 알림 지우기
     *
     * @param request 요청 정보
     */
    async function clear(request: NotificationDeleteRequest) {
        if(request.uids && request.uids.length)
            notifications.value = notifications.value.filter(item => !request.uids!.includes(item.uid))
        if(request.onlyRead)
            notifications.value = notifications.value.filter(item => !item.isRead)
        else
            notifications.value = []

        try {
            await NotificationService.deleteAll(request)
        }
        catch(error: any) {
            snackbarStore.show({ text: error.message })
        }
    }

    return {
        notifications,
        unreadCount,
        initialize,
        addNotification,
        markAsRead,
        clear
    }
})
