<template>
  <div>
    <div
      class="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 pb-4 text-white"
    >
      <div class="grid grid-cols-2 divide-x divide-white-8">
        <div>
          <div class="text-xl mb-4">
            For Investor, you can find idea at here to invest stock
          </div>
          <div class="inline-flex space-x-2">
            <TButton>
              <template #icon>
                <ArticleSvg />
              </template>
              View All Articles
            </TButton>
            <TButton>
              <template #icon>
                <StockSvg />
              </template>
              Find Stock
            </TButton>
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold">
            For author, you can share your idea on how to invest stock
          </div>
          <div class="text-xs">You might get tips from sharing your idea</div>
          <div class="h-4"></div>
          <TButton bg-color="bg-gray-900" hover-bg-color="hover:bg-gray-700">
            <template #icon>
              <AuthorSvg />
            </template>
            Become Author
          </TButton>
        </div>
      </div>
    </div>
    <div class="px-8 py-4">
      <div
        class="grid grid-cols-1 grid-cols-3 gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <FrontNewArticleList />
        <div class="h-8 bg-green-500"></div>
        <div class="h-8 bg-blue-500"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ArticleSvg: () => import('~/assets/svg/article.svg?inline'),
    StockSvg: () => import('~/assets/svg/stock.svg?inline'),
    AuthorSvg: () => import('~/assets/svg/author.svg?inline'),
  },
}
</script>
