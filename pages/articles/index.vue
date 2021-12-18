<template>
  <UtilAdsContainer>
    <div class="content">
      <h1 class="title">List of Articles</h1>
      <div class="search">
        <a-input v-model="searchText" placeholder="Search..." />
      </div>

      <a-spin :spinning="isLoadingSearch">
        <div v-for="(art, idx) in articleList" :key="idx" class="m-16">
          <ArticleCard :article-data="art" />
        </div>

        <div v-if="isContinuable" class="show-more-ctn" @click="showMore()">
          <span v-if="isLoadingNextArticle"><a-spin /></span>
          <span v-else>Show More <a-icon type="down" /></span>
        </div>
      </a-spin>

      <a-back-top />
    </div>
  </UtilAdsContainer>
</template>

<script>
import _ from 'lodash'
export default {
  auth: false,
  async asyncData({ $axios }) {
    const data = (await $axios.get('/api/articles/')).data
    return {
      articleList: data.results,
      currentPage: 1,
      isContinuable: data.next !== null,
    }
  },
  data() {
    return {
      searchText: '',
      isLoadingSearch: false,
      isLoadingNextArticle: false,
    }
  },
  head() {
    return {
      title: 'List of Articles',
    }
  },
  watch: {
    searchText: _.debounce(async function (value) {
      this.isLoadingSearch = true
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/articles/', {
          params: {
            filter: { article_title: this.searchText },
          },
        })
      ).data

      this.articleList = data.results
      this.currentPage = 1
      this.isContinuable = data.next !== null

      this.isLoadingSearch = false
    }, 500),
  },
  methods: {
    async showMore() {
      if (this.isLoadingNextArticle) {
        // To prevent multi load
        return
      }
      this.isLoadingNextArticle = true
      this.currentPage++
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/articles/', {
          params: {
            filter: { article_title: this.searchText },
            page: this.currentPage,
          },
        })
      ).data

      data.results.forEach((x) => {
        this.articleList.push(x)
      })

      this.isContinuable = data.next !== null
      this.isLoadingNextArticle = false
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  min-height: 100%;

  .title {
    padding: 16px 16px 0 16px;
  }

  .search {
    padding: 0 16px 16px 16px;
  }

  .show-more-ctn {
    margin: 16px;
    background: aliceblue;
    height: 100px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
