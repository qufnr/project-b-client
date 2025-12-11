const hasText = (value: any) =>
    typeof value === 'string' && !!value.trim()

export const StringUtils = {
    hasText,
}
