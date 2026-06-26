<script setup lang="ts">
const query = ref<JikanPaths['top/anime'][0]['query']>({
  page: 1,
})

// const { data, pending, error, refresh } = useJikan('top/anime', { query })
</script>

<template>
  <button class="btn" @click="++query.page!">Next page</button>
  <!-- <button class="btn" @click="refresh">Refresh</button> -->
  <button
    type="button"
    class="collapse-toggle btn btn-primary"
    id="basic-collapse"
    aria-expanded="false"
    aria-controls="basic-collapse-heading"
    data-collapse="#basic-collapse-heading"
  >
    Collapse
    <span class="icon-[tabler--chevron-down] collapse-open:rotate-180 size-4"></span>
  </button>

  <div
    id="basic-collapse-heading"
    class="collapse hidden w-full overflow-hidden transition-[height] duration-300"
    aria-labelledby="basic-collapse"
  >
    <div class="border-base-content/25 mt-3 rounded-md border p-3">
      <p class="text-base-content/80">
        The collapsible body remains concealed by default until the collapse plugin dynamically adds
        specific classes. These classes are instrumental in styling each element, dictating the
        overall appearance, and managing visibility through CSS transitions.
      </p>
    </div>
  </div>
  <!-- <div v-if="pending">loading...</div>
  <div v-else-if="error">
    <h1 class="text-red-500">Error occurred</h1>
  </div>
  <div v-else>
    <h1 class="text-red-500">{{ data }}</h1>
  </div> -->
</template>

<style scoped></style>
