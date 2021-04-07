<template>
  <div>
    <div
      class="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-white"
    >
      <div class="inline-flex space-x-4 items-center">
        <LogoSvg class="h-8 w-8" />
        <span class="text-xl font-bold">InvestHub</span>
      </div>
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
