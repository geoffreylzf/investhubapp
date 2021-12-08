<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
    <a-col :xs="24" :sm="16" class="content">
      <h1 class="title">List of Articles</h1>
      <a-input v-model="searchText" placeholder="Search..." class="search" />

      <a-spin :spinning="isLoadingSearch">
        <div
          v-for="(art, idx) in articleList"
          :key="idx"
          @click="goToArticle(art.id)"
        >
          <div class="art-ctn">
            <a-avatar
              class="art-ctn-avatar"
              :size="48"
              :src="art.author_img_path"
            />
            <div>
              <div class="font-weight-bold">{{ art.article_title }}</div>
              <div class="art-ctn-desc">
                {{
                  formatHumanDate(art.created_at) +
                  '. By ' +
                  art.author_first_name
                }}
              </div>
              <div class="mt-8">
                <a-tag v-for="t in art.topics" :key="t.id" color="blue">
                  {{ t.topic_name }}
                </a-tag>
              </div>
              <div class="mt-8">
                <a-tag
                  v-for="sc in art.stock_counters"
                  :key="sc.id"
                  color="purple"
                >
                  {{ sc.stock_symbol }}
                </a-tag>
              </div>
            </div>
          </div>
          <a-divider />
        </div>

        <div v-if="isContinuable" class="show-more-ctn" @click="showMore()">
          <span v-if="isLoadingNextArticle"><a-spin /></span>
          <span v-else>Show More <a-icon type="down" /></span>
        </div>
      </a-spin>

      <a-back-top />
    </a-col>
    <a-col :xs="0" :sm="4"> Advertisement </a-col>
  </a-row>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
export default {
  auth: false,
  async asyncData({ $axios }) {
    const data = (await $axios.get('/api/articles/')).data
    return {
      articleList: data.results,
      currentPage: data.pages,
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
      this.currentPage = data.pages
      this.isContinuable = data.next !== null

      this.isLoadingSearch = false
    }, 500),
  },
  methods: {
    formatHumanDate(datetime) {
      if (datetime) {
        return this.capitalizeFirstLetter(moment(datetime).fromNow())
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    goToArticle(id) {
      this.$router.push('/articles/' + id)
    },
    async showMore() {
      if (this.isLoadingNextArticle) {
        // To prevent multi load
        return
      }
      this.isLoadingNextArticle = true
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/articles/', {
          params: {
            filter: { article_title: this.searchText },
            page: this.currentPage++,
          },
        })
      ).data

      data.results.forEach((x) => {
        this.articleList.push(x)
      })

      this.currentPage = data.pages
      this.isContinuable = data.next !== null

      this.isLoadingNextArticle = false
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  padding: 16px;
  .content {
    padding: 0 16px;

    .search {
      margin-bottom: 20px;
    }
    .art-ctn {
      display: flex;
      cursor: pointer;

      .art-ctn-avatar {
        margin-right: 12px;
        flex: 0 0 48px;
      }

      .art-ctn-desc {
        font-size: 12px;
      }
    }

    .show-more-ctn {
      background: aliceblue;
      height: 100px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
