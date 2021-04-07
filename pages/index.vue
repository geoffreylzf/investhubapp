<template>
  <div
    class="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 pb-4 text-white"
  >
    <div class="grid grid-cols-2 divide-x divide-white-8">
      <div>
        <div class="text-xl mb-4">
          For Investor, you can find idea at here to invest stock
        </div>
        <TButton />
      </div>
      <div class="text-right">
        <div class="font-bold">
          For author, you can share your idea on how to invest stock
        </div>
        <div class="text-xs">You might get tips from sharing your idea</div>
        <div class="h-4"></div>
        <button
          class="px-4 py-2 inline-flex items-center border border-transparent font-medium rounded-sm text-white bg-black hover:bg-gray-700"
        >
          <AuthorSvg class="w-4 h4 mr-2 fill-current text-white" />
          <span> Become Author </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    AuthorSvg: () => import('~/assets/svg/author.svg?inline'),
  },
}
</script>
