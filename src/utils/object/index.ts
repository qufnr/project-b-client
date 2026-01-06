/**
 * 깊은 복사
 *
 * @param obj 객체
 */
const deepClone = (obj: any) =>
    window.structuredClone(obj)

export const ObjectUtils = {
    deepClone
}
