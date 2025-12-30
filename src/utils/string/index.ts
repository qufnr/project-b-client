/**
 * 문자열 존재 여부
 *
 * @param value 문자열
 */
const hasText = (value: any) =>
    value != null && typeof value === 'string' && !!value.trim()

/**
 * 문자열 내 HTML 태그 제거
 *
 * @param value 문자열
 * @param trim Trim 여부 (기본값: false)
 */
const removeHtmlTags = (value: string, trim: boolean = false) => {
    const text = value.replace(/<[^>]*>?/g, '')
    return trim ? text.trim() : text
}

export const StringUtils = {
    hasText, removeHtmlTags,
}
