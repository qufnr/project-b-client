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

/**
 * Textarea 문자열을 HTML 문자열로 변환합니다.
 *
 * @param value Textarea 문자열 값
 * @return 줄바꿈을 문단으로 처리한 문자열
 */
const textareaToHtml = (value: any): string => {
    if(!hasText(value))
        return '<p></p>'

    const correctTypeValue = value as string

    const lines = correctTypeValue.split('\n')
    return lines.map(line => `<p>${line}</p>`).join('')
}

/**
 * HTML 문자열을 Textarea 문자열로 변환합니다.
 *
 * @param value HTML 문자열 값
 * @return 문단을 줄바꿈으로 처리한 문자열
 */
const htmlToTextarea = (value: any): string =>
    hasText(value) ? value.replace(/<\/p>/gi, '\n').replace(/<p>/gi, '') : ''

export const StringUtils = {
    hasText, removeHtmlTags, textareaToHtml, htmlToTextarea
}
