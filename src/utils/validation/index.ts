import { i18n } from '@/plugins/vue-i18n.ts'
import { StringUtils } from '@/utils/string'

const { t } = i18n.global

/**
 * 필수 항목
 *
 * @param value 값
 * @return 입력이 없다면 오류 메시지 반환
 */
const required = (value: any): boolean | string => {
    if(!StringUtils.hasText(value))
        return t('message.validation.required')

    return true
}

/**
 * 최소 길이
 *
 * @param value 값
 * @param len 최소 길이
 * @return 최소 길이보다 작다면 오류 메시지 반환
 */
const minLength = (value: any, len: number): boolean | string => {
    if(Array.isArray(value) || typeof value === 'string')
        if(value.length < len)
            return t('message.validation.minLength', [len])

    return true
}

/**
 * 최대 길이
 *
 * @param value 값
 * @param len 최대 길이
 * @return 최대 길이보다 많으면 오류 메시지 반환
 */
const maxLength = (value: any, len: number): boolean | string => {
    if(Array.isArray(value) || typeof value === 'string')
        if(value.length > len)
            return t('message.validation.maxLength', [len])

    return true
}

/**
 * 문자열 이메일 패턴 확인
 *
 * @param value 값
 * @return 이메일 패턴이 올바르지 않으면 오류 메시지 반환
 */
const email = (value: string): boolean | string => {
    if(!StringUtils.hasText(value))
        return true

    const pattern: RegExp = /^([a-z0-9_\-.'+])+@([a-z0-9\-])+\.([a-z]{2,10})(?:\.[a-z]{2,10})?$/i

    if(!pattern.test(value))
        return t('message.validation.emailPatternMismatch')

    return true
}

/**
 * 두 번째 매개변수의 값과 동일한지 확인
 *
 * @param value 값
 * @param targetValue 비교 값
 * @param message I18n 메시지 키
 * @return 두 번째 매개변수 값과 동일하지 않다면 오류 메시지 반환
 */
const sameAs = (value: any, targetValue: any, message: string): boolean | string => {
    if(!value || (typeof value === 'string' && value.trim() === ''))
        return true

    if(value !== targetValue.value)
        return t(message)

    return true
}

/**
 * 비밀번호 검증
 *
 * @param value 값
 * @return 비밀번호 패턴이 올바르지 않으면 오류 메시지 반환
 */
const powerfulPassword = (value: string): boolean | string => {
    const pattern: RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/i

    if(!pattern.test(value))
        return t('message.validation.passwordPatternMismatch')

    return true
}

export type RuleFunction = (value: any) => string | boolean

export const Validation = {
    required,
    minLength,
    maxLength,
    email,
    sameAs,
    powerfulPassword,
}
