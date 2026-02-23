import http from '@/http'
import type { EnumItem } from '@/services/enumeration/types.ts'

export const EnumerationService = {
    /**
     * 열거형 변수 전체 조회
     *
     * @return 서버에 선언된 열거형 변수와 값 목록
     */
    read: async(): Promise<Record<string, EnumItem[]>> => (await http.get<Record<string, EnumItem[]>>('common-management/enums')).data,

    /**
     * 열거형 변수 단건 조회
     *
     * @param name Enum 이름
     * @return 조회한 열거형 변수의 값 목록
     */
    readByName: async(name: string): Promise<EnumItem[]> => (await http.get<EnumItem[]>(`common-management/enums/${name}`)).data
}
