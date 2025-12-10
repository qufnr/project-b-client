import { h } from 'vue'
import type { IconSet, IconAliases } from 'vuetify'

const currentStyle = 'rounded' as 'rounded' | 'outlined' | 'sharp'

export const materialSymbols: IconSet = {
    component: (props: any) => {
        return h(
            props.tag,
            {
                class: [`material-symbols-${currentStyle}`, props.class],
                style: props.style,
            },
            props.icon
        )
    }
}

export const aliases: IconAliases = {
    login: 'login',
    close: 'close',
    clear: 'clear',
    delete: 'delete',
    cancel: 'close',
    menu: 'menu',
    checkboxOn: 'check_box',
    checkboxOff: 'check_box_outline_blank',
    checkboxIndeterminate: 'indeterminate_check_box',
    delimiter: 'more_horiz',
    sort: 'sort',
    expand: 'expand_more',
    collapse: 'expand_less',
    complete: 'check',
    info: 'info',
    warning: 'warning',
    error: 'error',
    success: 'check_circle',
    add: 'add',
    edit: 'edit',
    search: 'search',
    prev: '',
    next: '',
    sortAsc: '',
    sortDesc: '',
    subgroup: '',
    dropdown: '',
    radioOn: '',
    radioOff: '',
    ratingEmpty: '',
    ratingFull: '',
    ratingHalf: '',
    loading: '',
    first: '',
    last: '',
    unfold: '',
    file: '',
    plus: '',
    minus: '',
    calendar: '',
    treeviewCollapse: '',
    treeviewExpand: '',
    eyeDropper: '',
    upload: '',
    color: '',
    command: '',
    ctrl: '',
    space: '',
    shift: '',
    alt: '',
    enter: '',
    arrowup: '',
    arrowdown: '',
    arrowleft: '',
    arrowright: '',
    backspace: '',

    playArrow: 'play_arrow',
}
