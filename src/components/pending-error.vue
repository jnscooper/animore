<script setup lang="ts">
const props = defineProps<{
  pending: boolean
  error?: boolean | Error
  refresh: () => void
}>()
</script>

<template>
  <div v-if="props.pending" class="h-7.5 text-center">
    <span class="loading"></span>
  </div>
  <div v-else-if="props.error" class="text-center">
    <span class="font-fugaz-normalize">Whoops, something went wrong.</span>
    <button class="btn btn-sm btn-text btn-circle" @click="props.refresh">
      <i class="icon-[tabler--refresh] size-4"></i>
    </button>
  </div>
</template>
