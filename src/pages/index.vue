<script setup lang="ts">
const { data, pending, error } = useJikan('genres/anime')
</script>

<template>
  <div v-if="pending">loading...</div>
  <div v-else-if="error">
    <h1 class="text-red-500">Error occurred</h1>
  </div>
  <div v-else>
    <h1 class="text-red-500">{{ data }}</h1>
  </div>
</template>

<style scoped></style>
