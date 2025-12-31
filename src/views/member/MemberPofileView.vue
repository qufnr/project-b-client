<script setup lang="ts">
//  사용자 프로필 화면

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMemberStore } from '@/stores/member'
import { useSnackbarStore } from '@/stores/snackbar'
import { MemberService } from '@/services/member'
import type { Member } from '@/services/member/types.ts'

//  Vue Router
const route = useRoute()

//  Member Store
const memberStore = useMemberStore()
const { member } = storeToRefs(memberStore)

//  Snackbar Store
const snackbarStore = useSnackbarStore()

const profile = ref<Member>()   //  프로필 정보
const loading = ref<boolean>(false) //  로딩 여부
const tab = ref<string>('feed')

onMounted(async () => {
    if(route.name === 'member.me')
        profile.value = member.value
    else {
        const uid: number = Number(route.params.uid)

        if(member.value.uid === uid) {
            profile.value = member.value
            return
        }

        try {
            loading.value = true
            profile.value = await MemberService.read(uid)
        }
        catch(error: any) {
            snackbarStore.show({ text: error.message })
        }
        finally {
            loading.value = false
        }
    }
})
</script>

<template>
    <div v-if="profile" class="pa-0 bg-background" style="min-height: 100vh;">
        <v-img v-if="profile.banner"
               :src="profile.banner"
               height="212"
               cover
               class="bg-grey-lighten-3"
        ></v-img>

        <v-container class="pt-6 pb-2">
            <div class="d-flex flex-column flex-md-row align-start align-md-center">

                <b-member-avatar-icon :member="member" size="160" class="mr-6" />

                <div class="mt-4 mt-md-0 flex-grow-1">
                    <h1 class="text-h4 font-weight-bold mb-1">
                        {{ profile.name }}
                    </h1>

                    <div class="text-subtitle-2 text-medium-emphasis mb-2">
                        <span class="mr-1">{{ `@${profile.id}` }}</span> •
                        <span class="mx-1">{{ '팔로우 1명' }}</span> •
                        <span class="ml-1">{{ '재생 목록 342개' }}</span>
                    </div>

                    <div class="text-body-2 text-medium-emphasis text-truncate mb-3" style="max-width: 600px;" v-html="profile.bio">
                    </div>

                    <div class="d-flex align-center">
                        <v-btn rounded="pill"
                               color="darken-2"
                               class="px-6 mr-3 text-none font-weight-bold"
                               elevation="0"
                               height="36"
                        >
                            {{ '팔로우' }}
                        </v-btn>

<!--                        <v-btn-->
<!--                            rounded="pill"-->
<!--                            variant="outlined"-->
<!--                            class="px-4 text-none font-weight-bold border-opacity-25"-->
<!--                            height="36"-->
<!--                            color="grey-darken-3"-->
<!--                        >-->
<!--                            {{ '가입' }}-->
<!--                        </v-btn>-->
                    </div>
                </div>
            </div>
        </v-container>

        <v-container class="pa-0 mt-2 border-b">
            <v-tabs v-model="tab"
                    bg-color="transparent"
                    color="default"
                    density="compact"
                    class="font-weight-bold text-capitalize"
            >
                <v-tab value="feed">{{ '피드' }}</v-tab>
                <v-tab value="playlist">{{ '재생 목록' }}</v-tab>
                <v-tab value="media">{{ '미디어' }}</v-tab>
<!--                <v-btn icon="mdi-magnify" variant="text" class="ml-auto mr-2"></v-btn>-->
            </v-tabs>
        </v-container>

<!--        <v-container class="py-6">-->

<!--            <div class="text-h6 font-weight-bold mb-4">{{ '최신 동영상' }}</div>-->

<!--            <v-row>-->
<!--                <v-col cols="12" sm="6" md="4" lg="3" v-for="n in 4" :key="n">-->
<!--                    <div class="cursor-pointer video-card-hover">-->
<!--                        <v-sheet class="rounded-lg position-relative overflow-hidden mb-2" color="grey-lighten-2">-->
<!--                            <v-img-->
<!--                                :src="`https://picsum.photos/seed/${n + 100}/400/225`"-->
<!--                                aspect-ratio="16/9"-->
<!--                                cover-->
<!--                            ></v-img>-->
<!--                            <div class="position-absolute bottom-0 right-0 ma-1 px-1 rounded bg-black text-caption font-weight-bold opacity-80">-->
<!--                                {{ '12:45' }}-->
<!--                            </div>-->
<!--                        </v-sheet>-->

<!--                        <div class="d-flex align-start">-->
<!--                            <div class="flex-grow-1 pr-2">-->
<!--                                <div class="text-subtitle-1 font-weight-bold lh-small line-clamp-2 mb-1">-->
<!--                                    {{ 'Vuetify 3 완벽 가이드 - ' + n + '번째 에피소드: 레이아웃 마스터하기' }}-->
<!--                                </div>-->
<!--                                <div class="text-caption text-medium-emphasis">-->
<!--                                    {{ '조회수 2.5만회 • 3일 전' }}-->
<!--                                </div>-->
<!--                            </div>-->
<!--                            <v-btn icon="mdi-dots-vertical" size="x-small" variant="text"></v-btn>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </v-col>-->
<!--            </v-row>-->

<!--            <v-divider class="my-6"></v-divider>-->

<!--            <div class="d-flex align-center mb-4">-->
<!--                <v-icon icon="mdi-fire" color="red" class="mr-2"></v-icon>-->
<!--                <span class="text-h6 font-weight-bold">{{ 'Shorts' }}</span>-->
<!--            </div>-->

<!--            <v-row dense>-->
<!--                <v-col cols="6" sm="4" md="2" v-for="s in 6" :key="`s-${s}`">-->
<!--                    <div class="cursor-pointer video-card-hover">-->
<!--                        <v-sheet class="rounded-xl position-relative overflow-hidden mb-2" color="grey-lighten-2">-->
<!--                            <v-img-->
<!--                                :src="`https://picsum.photos/seed/${s + 500}/200/350`"-->
<!--                                aspect-ratio="9/16"-->
<!--                                cover-->
<!--                            ></v-img>-->
<!--                        </v-sheet>-->
<!--                        <div class="text-subtitle-2 font-weight-bold line-clamp-2 mb-1">-->
<!--                            {{ '개발자 공감 모음 ㅋㅋㅋ #' + s }}-->
<!--                        </div>-->
<!--                        <div class="text-caption text-medium-emphasis">-->
<!--                            {{ '조회수 100만회' }}-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </v-col>-->
<!--            </v-row>-->

<!--        </v-container>-->
    </div>
</template>

<style scoped>

</style>
