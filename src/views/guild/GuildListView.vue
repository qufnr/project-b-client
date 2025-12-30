<script setup lang="ts">
import guilds from '@/services/guild/guilds.json'
</script>

<template>
    <v-row>
        <v-col v-for="(guild, i) in guilds" :key="i" cols="4">
            <b-guild-card :guild="guild" />
        </v-col>
    </v-row>
</template>
