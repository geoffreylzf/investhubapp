<template>
  <UtilAdsContainer>
    <div class="content">
      <h1 class="title">List of Articles</h1>
      <div class="search">
        <a-input v-model="searchText" placeholder="Search..." />
      </div>

      <a-spin :spinning="isLoadingSearch">
        <nuxt-link
          v-for="(art, idx) in articleList"
          :key="idx"
          class="link"
          :to="'/articles/' + art.id"
        >
          <a-card class="art-card" hoverable>
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
                    art.author_first_name +
                    '. ' +
                    formatHumanDate(art.created_at)
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
                <div class="art-ctn-comment mt-8">
                  <b>{{ art.comment_count }}</b> comments
                  <b>{{ art.view_count }}</b> views
                </div>
              </div>
            </div>
          </a-card>
        </nuxt-link>

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
import moment from 'moment'
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
    formatHumanDate(datetime) {
      if (datetime) {
        return this.capitalizeFirstLetter(moment(datetime).fromNow())
      }
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
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

  .link {
    text-decoration: none;
    color: inherit;
  }

  .art-card {
    margin: 16px;

    ::v-deep .ant-card-body {
      padding: 0;

      .art-ctn {
        padding: 16px;
        display: flex;
        cursor: pointer;

        .art-ctn-avatar {
          margin-right: 12px;
          flex: 0 0 48px;
        }

        .art-ctn-desc {
          font-size: 12px;
        }

        .art-ctn-comment {
          font-size: 12px;
        }
      }
    }
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
