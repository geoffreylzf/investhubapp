<template>
  <div>
    <a-skeleton v-if="isMounting" active avatar :loading="isMounting" />
    <div v-else>
      <div v-if="articleList.length === 0">
        <a-alert
          message="You did not follow any author"
          description="Try to check the article and follow it's author"
          type="info"
          show-icon
        />
      </div>
      <div v-else>
        <div class="content-title">
          <span v-if="isAuthenticated">Your Timeline</span>
          <span v-else>Latest Article</span>
        </div>
        <div v-for="(art, idx) in articleList" :key="idx" class="mb-16">
          <ArticleCard :article-data="art" />
        </div>

        <div
          v-if="isContinuable && isAuthenticated"
          class="show-more-ctn"
          @click="showMore()"
        >
          <span v-if="isLoadingNextArticle"><a-spin /></span>
          <span v-else>Show More <a-icon type="down" /></span>
        </div>
        <div
          v-if="isContinuable && !isAuthenticated"
          class="no-show-more-ctn"
          @click="toLoginPage()"
        >
          <span>Log in or Sign in to view more</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isMounting: true,
      articleList: [],
      currentPage: 1,
      isContinuable: false,

      isLoadingNextArticle: false,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  async mounted() {
    const data = (await this.$axios.get('/api/home/timeline/')).data
    this.articleList = data.results
    this.currentPage = 1
    this.isContinuable = data.next !== null

    this.isMounting = false
  },
  methods: {
    toLoginPage() {
      this.$router.push('/login')
    },
    async showMore() {
      if (this.isLoadingNextArticle) {
        // To prevent multi load
        return
      }
      this.isLoadingNextArticle = true
      this.currentPage++
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/home/timeline/', {
          params: {
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
.content-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
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

.no-show-more-ctn {
  margin: 16px;
  background: lightcoral;
  height: 100px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
