<template>
  <button
    class="px-4 py-2 inline-flex items-center border border-transparent font-medium rounded-sm text-white bg-black hover:bg-gray-700"
  >
    <AuthorSvg class="w-4 h4 mr-2 fill-current text-white" />
    <span> Become Author </span>
  </button>
</template>

<script>
export default {
  components: {
    AuthorSvg: () => import('~/assets/svg/author.svg?inline'),
  },
}
</script>
