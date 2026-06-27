<script setup lang="ts">
import { decode } from '@/utils/encrypt'
import { filter } from 'lodash-es'

const route = useRoute('/anime/[id]')
const id = route.params.id
const preview = decode<string>((route.query.c ?? '') as string)

const { data: detail } = useJikan('anime/{id}/full', { id, unwrap: { data: true } })

const src = computed(() => preview ?? detail.value.images.webp.image_url)

const { data: characterList } = useJikan('anime/{id}/characters', { id, unwrap: { data: true } })
const mainCharacterList = computed(() => {
  return filter(characterList.value, (item) => item.role === 'Main')
})
</script>

<template>
  <div data-page="anime-detail" class="page">
    <section id="hero-section" class="overflow-hidden rounded-box relative">
      <div
        class="absolute inset-0 scale-110 bg-cover bg-top blur-md"
        :style="{
          backgroundImage: `url(${src})`,
          maskImage: 'linear-gradient(to bottom, transparent 45%, black 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 45%, black 70%)',
        }"
      />
      <div
        class="absolute inset-0 bg-black/40"
        :style="{
          maskImage: 'linear-gradient(to bottom, transparent 45%, black 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 45%, black 70%)',
        }"
      />

      <div class="relative z-10 flex flex-col items-center gap-4">
        <img
          :src="src"
          :alt="detail?.title"
          class="h-[clamp(18rem,24vw,22rem)] aspect-3/4 object-cover rounded-box"
        />
        <div class="flex flex-col justify-center items-center gap-2 p-4">
          <h1 class="text-3xl text-base-100">{{ detail?.title }}</h1>
          <ul class="flex gap-2 flex-wrap items-center justify-center">
            <li class="badge badge-primary badge-soft">
              <i class="icon-[tabler--star-filled] size-4"></i>
              <span class="mt-0.5">{{ detail?.score }}</span>
            </li>
            <li class="badge badge-primary badge-soft">
              {{ detail?.year }}
            </li>
            <li class="badge badge-primary badge-soft">
              {{ detail?.type }}
            </li>
            <li class="badge badge-primary badge-soft">
              <span class="mt-0.5">{{ detail?.source }}</span>
            </li>
            <li v-if="detail?.airing" class="badge badge-primary badge-soft">
              <span class="mt-0.5">Airing</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <section class="flex flex-col gap-4">
      <div v-for="(item, index) in [detail?.synopsis, detail?.background]" :key="index">
        <h2 class="uppercase text-lg">{{ index === 0 ? 'Synopsis' : 'Background' }}</h2>
        <p class="font-serif italic indent-4">{{ item }}</p>
      </div>
    </section>
    <section id="characters">
      <h2 class="uppercase text-lg">Characters</h2>
      <ul v-if="mainCharacterList?.length">
        <p>{{ mainCharacterList?.length || 0 }}</p>
        <li v-for="(item, index) in mainCharacterList" :key="index">
          {{ item.character.name }}
        </li>
      </ul>
    </section>
  </div>
</template>
