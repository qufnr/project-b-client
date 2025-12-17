const hasText = (value: any) =>
    value != null && typeof value === 'string' && !!value.trim()

export const StringUtils = {
    hasText,
}
