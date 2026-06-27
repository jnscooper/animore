<script setup lang="ts">
import { getMaxRadius } from '@/utils/calculate'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import type Lenis from 'lenis'

const { lenis } = defineProps<{ lenis: Lenis }>()

const overlayRef = useTemplateRef('overlay')
const isOpen = ref(false)
const closeBtnRef = useTemplateRef('close-btn')

const menus = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Anime',
    path: '/anime',
  },
  {
    label: 'Manga',
    path: '/manga',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'My Portfolio',
    path: 'https://jnscooper.github.io',
  },
]

const split = computed(() => SplitText.create('.menu-item', { type: 'chars,words,lines' }))

/**
 * @todo sync states when animation was interrupted
 */
const handleToggleMenu = (e: PointerEvent) => {
  const button = e.currentTarget as HTMLElement

  const rect = button.getBoundingClientRect()

  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  const radius = getMaxRadius(x, y)

  if (isOpen.value) {
    gsap
      .timeline({
        onComplete: () => scrollLock('release'),
      })
      .to(overlayRef.value, {
        clipPath: `circle(${rect.width / 2}px at ${x}px ${y}px)`,
        duration: 0.8,
        ease: 'expo.inOut',
      })
      .set(split.value.lines, {
        rotationY: -100,
        transformOrigin: '50% 50%',
        visibility: 'hidden',
      })
      .set('[aria-current="page"]', {
        '--scale': 0,
      })
      .set(overlayRef.value, {
        clearProps: 'all',
      })
  } else {
    gsap
      .timeline({
        onStart: () => scrollLock('lock'),
        onComplete: () => {
          gsap
            .fromTo(
              split.value.lines,
              {
                rotationY: -100,
                transformOrigin: '50% 50%',
              },
              {
                visibility: 'visible',
                rotationY: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.25,
              },
            )
            .eventCallback('onComplete', () => {
              gsap.to('[aria-current="page"]', {
                '--scale': 1,
                duration: 0.5,
                ease: 'power3.out',
              })
            })
        },
      })
      .set(overlayRef.value, {
        display: 'block',
        position: 'fixed',
        inset: 0,
        clipPath: `circle(${rect.width / 2}px at ${x}px ${y}px)`,
      })
      .set(closeBtnRef.value, {
        position: 'fixed',
        left: x,
        top: y,
        xPercent: -50,
        yPercent: -50,
      })
      .to(overlayRef.value, {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.8,
        ease: 'expo.inOut',
      })
  }

  isOpen.value = !isOpen.value
}

const scrollLock = (type: 'lock' | 'release') => {
  lenis[type === 'lock' ? 'stop' : 'start']()
}

onMounted(() => {
  ScrollTrigger.create({
    trigger: document.body,
    pin: '#header',
    start: '16px top',
    pinSpacing: false,
    scrub: true,
  })
})
</script>

<template>
  <teleport to="body">
    <div ref="overlay" class="hidden bg-neutral/10 backdrop-blur-2xl z-101 overflow-hidden">
      <button
        ref="close-btn"
        class="collapse-toggle btn btn-text btn-circle"
        @click="handleToggleMenu"
      >
        <i class="icon-[tabler--x]"></i>
      </button>
      <ul class="absolute top-24 right-4 left-4">
        <li
          v-for="menu in menus"
          :key="menu.path"
          class="menu-item invisible relative cursor-pointer"
        >
          <a
            v-if="menu.path.startsWith('http')"
            :href="menu.path"
            target="  "
            class="inline-block w-full text-end p-4 rounded-box font-fugaz text-lg"
          >
            {{ menu.label }}
          </a>
          <router-link
            v-else
            :to="menu.path"
            class="inline-block w-full text-end p-4 rounded-box font-fugaz text-lg relative after:absolute after:content-[''] after:right-0 after:inset-y-4 after:w-1 after:bg-primary after:scale-(--scale) after:origin-top"
            style="--scale: 0"
          >
            {{ menu.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </teleport>
  <header id="header" class="bg-base-100 overflow-hidden z-100">
    <nav class="navbar shadow mt-4">
      <div class="w-full flex items-center">
        <div class="navbar-start">
          <h1
            class="font-fugaz gradient-bg gradient-bg-primary text-transparent bg-clip-text text-3xl flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 48 48"
              class="fill-primary"
            >
              <path d="M0 0h48v48H0z" fill="none" />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M23.805 40.396a3.84 3.84 0 0 1-3.298-5.799l7.964-13.415a3.84 3.84 0 0 1 6.603 3.919L27.11 38.517a3.84 3.84 0 0 1-3.305 1.88ZM16.15 28.698a3.837 3.837 0 0 1-3.297-5.798l7.965-13.416a3.837 3.837 0 0 1 5.26-1.34a3.837 3.837 0 0 1 1.341 5.26l-7.965 13.415a3.84 3.84 0 0 1-3.305 1.879"
              />
              <circle
                cx="9.335"
                cy="36.556"
                r="3.835"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="38.665"
                cy="36.556"
                r="3.835"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>ni</span><span>more</span>
          </h1>
        </div>
        <div class="navbar-end">
          <button class="collapse-toggle btn btn-text btn-circle">
            <i class="icon-[tabler--search]"></i>
          </button>
          <button class="collapse-toggle btn btn-text btn-circle" @click="handleToggleMenu">
            <i class="icon-[tabler--menu-deep]"></i>
          </button>
        </div>
      </div>
    </nav>
  </header>
  <main class="min-h-screen p-6">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.path" />
      </keep-alive>
    </router-view>
  </main>
  <footer
    class="w-full max-w-(--breakpoint-2xl) mx-auto pt-20 p-6 font-fugaz text-[clamp(10.5px,2vw,14px)] text-neutral/50 flex flex-col md:flex-row justify-center items-center md:justify-between md:items-end"
  >
    <div class="flex flex-col justify-center items-center md:items-start">
      <div>
        Anime data from
        <a href="https://jikan.moe/" target="_blank" class="link link-secondary">Jikan API</a>.
      </div>
      <div>Images belong to their respective copyright holders.</div>
    </div>
    <div class="flex flex-col justify-center items-center md:items-end">
      <div>
        &copy;
        <!-- @prettier-ignore -->
        2026 {{ new Date().getFullYear() > 2026 ? '-' + new Date().getFullYear() : '' }} Animore.
        <!-- @prettier-ignore -->
        All rights reserved.
      </div>
      <div>
        Developed by
        <a href="https://jnscooper.github.io/" target="_blank" class="link link-secondary">JCoop</a>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
