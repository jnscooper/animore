<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import { isMobile } from '@/utils/device'

const {
  data: airingAnime,
  pending: airingPending,
  error: airingError,
  refresh: airingRefresh,
} = useJikan('top/anime', { query: { filter: 'airing', limit: 10 } })

const {
  data: popularAnime,
  pending: popularPending,
  error: popularError,
  refresh: popularRefresh,
} = useJikan('top/anime', { query: { filter: 'bypopularity', limit: 10 } })

const {
  data: upcomingAnime,
  pending: upcomingPending,
  error: upcomingError,
  refresh: upcomingRefresh,
} = useJikan('top/anime', { query: { filter: 'upcoming', limit: 10 } })

const sections = computed(() => [
  {
    title: 'Airing',
    icon: 'icon-[tabler--device-tv-filled]',
    items: airingAnime.value?.data || [],
    pending: airingPending.value,
    error: airingError.value,
    refresh: airingRefresh,
  },
  {
    title: 'Most Popular',
    icon: 'icon-[tabler--trending-up]',
    items: popularAnime.value?.data || [],
    pending: popularPending.value,
    error: popularError.value,
    refresh: popularRefresh,
  },
  {
    title: 'Upcoming',
    icon: 'icon-[tabler--calendar-time]',
    items: upcomingAnime.value?.data || [],
    pending: upcomingPending.value,
    error: upcomingError.value,
    refresh: upcomingRefresh,
  },
])
</script>

<template>
  <div data-page="home" class="page space-y-10">
    <section v-for="section in sections" :key="section.title">
      <div class="flex justify-between items-center mb-2">
        <h1 class="flex gap-1">
          <i :class="section.icon"></i>
          <span class="font-fugaz-normalize text-lg">{{ section.title }}</span>
        </h1>
        <router-link to="/" class="flex items-center-safe gap-1">
          <span class="font-fugaz-normalize text-sm hidden sm:block">View All</span>
          <i class="icon-[tabler--chevron-right] size-4"></i>
        </router-link>
      </div>
      <pending-error :pending="section.pending" :error="section.error" :refresh="section.refresh" />
      <swiper
        v-if="section.items"
        :modules="[Navigation]"
        :navigation="{ nextEl: '.custom-next', prevEl: '.custom-prev', disabledClass: 'hidden' }"
        :simulate-touch="false"
        :space-between="16"
        slides-per-view="auto"
        class="size-full flex flex-nowrap rounded-box"
      >
        <div
          class="custom-prev absolute left-0 inset-y-0 w-12 z-10 flex justify-start items-center bg-linear-to-l from-transparent via-base-100/30 to-base-100 cursor-pointer"
          :class="{ 'pointer-events-none': isMobile() }"
        >
          <i v-if="!isMobile()" class="icon-[tabler--chevron-compact-left] bg-base-content"></i>
        </div>
        <swiper-slide
          v-for="item in section.items"
          :key="item.mal_id"
          class="h-64 aspect-3/4 w-auto!"
        >
          <router-link to="/" class="relative inline-block h-64 aspect-3/4">
            <img
              :src="item.images.webp.image_url"
              :alt="item.title"
              class="size-full object-cover rounded-t-box"
            />
            <div
              class="absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent via-black/30 to-base-100 text-white p-3 *:font-fugaz-normalize"
            >
              <h2 class="line-clamp-2">{{ item.title }}</h2>
              <span v-if="item.score" class="text-primary font-bold absolute bottom-1 right-3">
                {{ item.score.toFixed(1) }}
              </span>
            </div>
          </router-link>
        </swiper-slide>
        <div
          class="custom-next absolute right-0 inset-y-0 w-12 z-10 flex justify-end items-center bg-linear-to-r from-transparent via-base-100/30 to-base-100 cursor-pointer"
        >
          <i v-if="!isMobile()" class="icon-[tabler--chevron-compact-right] bg-base-content"></i>
        </div>
      </swiper>
    </section>
  </div>
</template>

<style scoped></style>
