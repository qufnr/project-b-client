<script setup lang="ts">
import parties from '@/services/guild/guilds.json'
</script>

<template>
    <v-row>
        <v-col v-for="(party, i) in parties" :key="i" cols="4">
            <b-party-card :party="party" />
        </v-col>
    </v-row>
</template>
