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
    prev: 'chevron_backward',
    next: 'chevron_forward',
    sortAsc: '',
    sortDesc: '',
    subgroup: 'arrow_drop_down',
    dropdown: '',
    radioOn: 'radio_button_checked',
    radioOff: 'radio_button_unchecked',
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
    calendar: 'calendar_today',
    treeviewCollapse: '',
    treeviewExpand: 'expand',
    eyeDropper: 'dropper_eye',
    upload: 'upload',
    color: 'colors',
    command: 'keyboard_command_key',
    ctrl: 'keyboard_control_key',
    space: 'space_bar',
    shift: 'shift',
    alt: 'keyboard_option_key',
    enter: 'keyboard_return',
    arrowup: 'arrow_upward_alt',
    arrowdown: 'arrow_downward_alt',
    arrowleft: 'arrow_left_alt',
    arrowright: 'arrow_right_alt',
    backspace: '',

    playArrow: 'play_arrow',
    celebration: 'celebration',
    accountCircle: 'account_circle',
    musicNote: 'music_note',
    moreHoriz: 'more_horiz',
    moreVert: 'more_vert',
    cake: 'cake',
}
