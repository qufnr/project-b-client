<script setup lang="ts">

</script>

<template>
    <v-empty-state text="Hello world.">
        <template #actions>
            <div class="d-flex justify-space-between">
                <v-btn class="text-capitalize" prepend-icon="login">Sign In</v-btn>
            </div>
        </template>
    </v-empty-state>
</template>

<style scoped>

</style>
