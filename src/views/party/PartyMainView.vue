<script setup lang="ts">
const parties = [
    {
        name: `테스트계정의 파티`,
        bio: `<p>테스트로 생성한 파티에요</p>`,
        icon: '',
        banner: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        members: 24,
        isPlaying: false,
        colour: '#FF8EEA',
        owner: {
            uid: 224,
            id: 'test.user11',
            name: '테스트계정',
            colour: '#CC86FF',
            bio: `<p></p>`,
            lastSignedAt: '',
            isLocked: false,
            isEnabled: true,
            isVerified: true,
            authorities: ['MEMBER'],
            privacy: {
                isPublic: true,
                isBirthdayPublic: true
            }
        }
    },
    {
        name: `테스트계정의 파티`,
        bio: `<p>테스트로 생성한 파티에요</p>`,
        icon: '',
        banner: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        members: 24,
        isPlaying: false,
        colour: '#FF8EEA',
        owner: {
            uid: 224,
            id: 'test.user11',
            name: '테스트계정',
            colour: '#CC86FF',
            bio: `<p></p>`,
            lastSignedAt: '',
            isLocked: false,
            isEnabled: true,
            isVerified: true,
            authorities: ['MEMBER'],
            privacy: {
                isPublic: true,
                isBirthdayPublic: true
            }
        }
    },
    {
        name: `테스트계정의 파티`,
        bio: `<p>테스트로 생성한 파티에요</p>`,
        icon: '',
        banner: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        members: 24,
        isPlaying: false,
        colour: '#FF8EEA',
        owner: {
            uid: 224,
            id: 'test.user11',
            name: '테스트계정',
            colour: '#CC86FF',
            bio: `<p></p>`,
            lastSignedAt: '',
            isLocked: false,
            isEnabled: true,
            isVerified: true,
            authorities: ['MEMBER'],
            privacy: {
                isPublic: true,
                isBirthdayPublic: true
            }
        }
    },
    {
        name: `테스트계정의 파티`,
        bio: `<p>테스트로 생성한 파티에요</p>`,
        icon: '',
        banner: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        members: 24,
        isPlaying: false,
        colour: '#FF8EEA',
        owner: {
            uid: 224,
            id: 'test.user11',
            name: '테스트계정',
            colour: '#CC86FF',
            bio: `<p></p>`,
            lastSignedAt: '',
            isLocked: false,
            isEnabled: true,
            isVerified: true,
            authorities: ['MEMBER'],
            privacy: {
                isPublic: true,
                isBirthdayPublic: true
            }
        }
    },
    {
        name: `테스트계정의 파티`,
        bio: `<p>테스트로 생성한 파티에요</p>`,
        icon: '',
        banner: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
        members: 24,
        isPlaying: false,
        colour: '#FF8EEA',
        owner: {
            uid: 224,
            id: 'test.user11',
            name: '테스트계정',
            colour: '#CC86FF',
            bio: `<p></p>`,
            lastSignedAt: '',
            isLocked: false,
            isEnabled: true,
            isVerified: true,
            authorities: ['MEMBER'],
            privacy: {
                isPublic: true,
                isBirthdayPublic: true
            }
        }
    }
]
</script>

<template>
    <div>
        Contents is here.
    </div>
    <v-row>
        <v-col v-for="(party, i) in parties" :key="i" cols="4">
            <b-party-card :party="party" />
        </v-col>
    </v-row>
</template>
