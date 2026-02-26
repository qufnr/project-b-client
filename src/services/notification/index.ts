import http from '@/http'
import type { PaginationResponse } from '@/http/types.ts'
import type {
    NotificationDeleteRequest,
    NotificationReadRequest,
    NotificationDetails,
    NotificationUpdateRequest
} from '@/services/notification/types.ts'

export const NotificationService = {
    /**
     * 알림 조회
     *
     * @param request 요청 정보
     * @return 페이지 응답
     */
    read: async (request: NotificationReadRequest) =>
        (await http.get<PaginationResponse<NotificationDetails>>(`notification-management/notifications`, { params: request })).data,

    /**
     * 알림 수정 (읽음 처리)
     *
     * @param uid 알림 UID
     * @param request 요청 정보
     */
    update: async (uid: number, request: NotificationUpdateRequest) => await http.put(`notification-management/notifications/${uid}`, { params: request }),

    /**
     * 알림 단건 삭제
     *
     * @param uid 알림 UID
     */
    delete: async (uid: number) => await http.delete(`notification-management/notifications/${uid}`),

    /**
     * 알림 일괄 삭제
     *
     * @param request 요청 정보
     */
    deleteAll: async (request: NotificationDeleteRequest) =>
        await http.delete('notification-management/notifications', { params: request })
}
