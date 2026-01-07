/**
 * 깊은 복사
 *
 * @param obj 객체
 * @remarks DOM 이 그려지기 전에 호출하면 안 됨
 */
const deepClone = (obj: any): any =>
    window.structuredClone(obj)

/**
 * 두 값이 동일한지 판단
 *
 * @param x First value
 * @param y Second value
 */
const isDeepEquals = (x: any, y: any): boolean => {
    //  둘 다 원시값이거나 참조가 같으면 일치
    if(x === y)
        return true

    //  둘 중 하나라도 객체/배열이 아니면 불일치
    if(typeof x !== 'object' || x === null || typeof y !== 'object' || y === null)
        return false

    const xKeys = Object.keys(x)
    const yKeys = Object.keys(y)
    //  두 값의 키 개수가 다르면 불일치
    if(xKeys.length !== yKeys.length)
        return false

    //  재귀적으로 내부 값 비교
    for(const key of xKeys) {
        if(!yKeys.includes(key) || !isDeepEquals(x[key], y[key]))
            return false
    }

    return true
}

/**
 * source 에 대해 target 값이 바뀌었는지 판단
 *
 * @param source 원본 데이터 ex) { name: 'aris', age: 15, height: 149 }
 * @param target 변경 데이터 ex) { name: 'tendou', height: 150 }
 */
const hasDifference = (source: object, target: object) => {
    const keys = Object.keys(target)
    for(const key of keys) {
        if(!isDeepEquals(source[key], target[key]))
            return true
    }

    return false
}

export const ObjectUtils = {
    deepClone,
    isDeepEquals,
    hasDifference
}
