<template>
  <div>
    <div
      class="
        bg-gradient-to-r
        from-indigo-600
        to-purple-500
        px-6
        py-2
        text-white
      "
    >
      <NuxtLink to="/">
        <div class="inline-flex space-x-2 items-center">
          <LogoSvg class="h-4 w-4" />
          <span class="text-base font-medium">InvestHub</span>
        </div>
      </NuxtLink>
    </div>
    <Nuxt />
  </div>
</template>
<script>
export default {
  components: {
    LogoSvg: () => import('~/assets/svg/logo.svg?inline'),
  },
}
</script>
