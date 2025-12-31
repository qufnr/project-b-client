<script setup lang="ts">
import { useDisplay } from 'vuetify'
import guilds from '@/services/guild/guilds.json'

const { lgAndDown } = useDisplay()
</script>

<template>
    <v-container :fluid="lgAndDown">
        <v-row>
            <v-col v-for="(guild, i) in guilds" :key="i" cols="12" xxl="2" xl="3" md="4" sm="6">
                <b-guild-card :guild="guild" />
            </v-col>
        </v-row>
    </v-container>
</template>
