import type { Member } from '@/services/member/types.ts'

export interface Guild {
    name: string
    bio: string
    icon: string
    banner: string
    colour: string
    joinedMembers: number
    hasPassword: boolean
    playStatus: GuildPlayStatus,
    owner: Member
}

export interface GuildPlayStatus {
    isNowPlaying: boolean
    media: {
        title: string
        source: 'YOUTUBE' | 'SOUNDCLOUD' | 'NICONICO' | null
        duration: number
    }
}
