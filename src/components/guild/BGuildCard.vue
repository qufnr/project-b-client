<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { StringUtils } from '@/utils/string'
import type { Guild } from '@/services/guild/types.ts'

interface BGuildCardProps {
    guild: Guild
}

interface BGuildCardEmits {
    click: [guild: Guild]
}

//  Vue I18n
const { t } = useI18n()

//  Props
const { guild } = defineProps<BGuildCardProps>()

//  Emits
const emits = defineEmits<BGuildCardEmits>()

//  길드 소개
const description = computed(() =>
    !StringUtils.hasText(StringUtils.removeHtmlTags(guild.bio, true))
        ? '&nbsp;'
        : guild.bio
)
</script>

<template>
    <v-card class="select-none"
            color="background"
            min-height="360"
            elevation="0"
            v-ripple
            @click.stop="emits('click', guild)"
    >
        <!-- 상단 파티 배너 이미지 -->
        <v-img class="d-flex justify-space-between text-white"
               height="230"
               :src="guild.banner"
               color="darken-2"
               cover
        >
            <!-- 파티 아이콘, 이름 -->
            <div class="d-flex align-center justify-space-between pt-2 px-3">
                <div class="d-flex align-center ga-2">
                    <b-guild-icon :party="guild" size="38" />
                    <p class="fs-1 font-weight-bold">{{ guild.name }}</p>
                </div>
                <!-- 더보기 버튼 -->
                <v-btn color="default" variant="text" icon="more_horiz"></v-btn>
            </div>

        </v-img>
        <v-spacer class="my-2" />
        <!-- 파티 설명 -->
        <v-card-subtitle v-html="description"></v-card-subtitle>
        <v-card-text>
            <!-- 파티 설립자 -->
            <div class="d-flex align-center ga-2">
                <b-member-icon :member="guild.owner" size="28" />
                <p v-if="guild.joinedMembers > 1">
                    {{
                        t('text.party.andOthers', [guild.owner.name, guild.joinedMembers - 1])
                    }}
                </p>
                <p v-else>{{ guild.owner.name }}</p>
            </div>

            <v-spacer class="my-2" />

            <div class="party-card__etc">
                <!-- 재생 중인 미디어 -->
                <div class="d-flex align-center bg-surface py-1 px-2 rounded-xl">
                    <v-icon size="16">music_note</v-icon>
                    <b-scroll-text v-if="guild.playStatus.isNowPlaying"
                                   :value="guild.playStatus.media.title"
                    />
                    <div v-else>
                        <i class="text-darken">Not now playing</i>
                    </div>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<style lang="scss" scoped>
.party-card {
    .party-card__banner {
        display: flex;
        justify-content: space-between;
        color: #FFF;
    }

    .party-card__banner__content {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .party-card__owner {
        display: flex;
        align-items: center;
        gap: 8px;
    }
}
</style>
