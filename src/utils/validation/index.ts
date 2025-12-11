import { i18n } from '@/plugins/vue-i18n.ts'
import { StringUtils } from '@/utils/string'

const { t } = i18n.global

const required = (value: any) => {
    if(!StringUtils.hasText(value))
        return t('message.validation.required')

    return true
}

export type RuleFunction = (value: any) => string | boolean

export const Validation = {
    required,
}
