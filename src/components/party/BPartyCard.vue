<script setup lang="ts">
interface BPartyCardProps {
    party: any  //  TODO :: 파티 타입 선정
}

const { party } = defineProps<BPartyCardProps>()
</script>

<template>
    <v-card class="party-card" color="background" elevation="0">
        <!-- 상단 파티 배너 이미지 -->
        <v-img class="party-card__banner"
               height="200"
               :src="party.banner"
               cover
        >
            <!-- 파티 아이콘, 이름 -->
            <div class="party-card__banner__content">
                <b-party-icon :party="party" />
                <p class="fs-1 font-weight-bold">{{ party.name }}</p>
            </div>
        </v-img>
        <v-spacer class="my-2" />
        <!-- 파티 설명 -->
        <v-card-subtitle v-html="party.bio"></v-card-subtitle>
        <v-card-text>
            <!-- 파티 설립자 -->
            <div class="party-card__owner">
                <b-member-avatar-icon :member="party.owner" size="28" />
                <p>{{ party.owner.name }}</p>
            </div>

            <v-spacer class="my-2" />

            <div class="party-card__etc">
                <p class="text-caption">members: {{ party.members }}</p>
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
