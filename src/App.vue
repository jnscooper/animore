<script setup lang="ts">
import { VueLenis } from 'lenis/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'

const lenisRef = ref<InstanceType<typeof VueLenis>>()

watchEffect((onCleanup) => {
  if (!lenisRef.value?.lenis) return

  //  if using GSAP ScrollTrigger, update ScrollTrigger on scroll
  lenisRef.value.lenis.on('scroll', ScrollTrigger.update)

  // add the Lenis requestAnimationFrame (raf) method to GSAP's ticker
  // this ensures Lenis's smooth scroll animation updates on each GSAP tick
  const update = (time: number) => {
    lenisRef.value?.lenis?.raf(time * 1000)
  }
  gsap.ticker.add(update)

  // disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0)

  // clean up GSAP's ticker from the previous execution of watchEffect, or when the effect is stopped
  onCleanup(() => {
    gsap.ticker.remove(update)
  })
})

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)
  ScrollSmoother.create({
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
  })
})

onErrorCaptured((err) => {
  console.error(err)
})
</script>

<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <vue-lenis root ref="lenisRef" :options="{ autoRaf: false, allowNestedScroll: true }">
        <router-view :lenis="lenisRef?.lenis" />
      </vue-lenis>
    </div>
  </div>
</template>

<style scoped></style>
