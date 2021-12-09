<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
    <a-col :xs="24" :sm="16" class="content">
      <h1 class="title">List of Authors</h1>
      <a-input v-model="searchText" placeholder="Search..." class="mb-20" />

      <a-spin :spinning="isLoadingSearch">
        <a-row :gutter="[8, 8]">
          <a-col
            v-for="(aut, idx) in authorList"
            :key="idx"
            :xs="24"
            :sm="12"
            :lg="8"
          >
            <nuxt-link :to="'/authors/' + aut.id">
              <a-card hoverable class="author-card">
                <div class="text-center">
                  <a-avatar :size="64" :src="aut.img_path" />
                  <div class="author-name">{{ aut.first_name }}</div>
                  <div class="author-date">
                    Joined {{ formatHumanDate(aut.created_at) }}
                  </div>
                  <div class="author-bio">{{ aut.bio }}</div>
                  <div class="author-article">
                    Wrote {{ aut.article_count }} articles
                  </div>
                </div>
              </a-card>
            </nuxt-link>
          </a-col>
        </a-row>

        <div v-if="isContinuable" class="show-more-ctn" @click="showMore()">
          <span v-if="isLoadingNextAuthor"><a-spin /></span>
          <span v-else>Show More <a-icon type="down" /></span>
        </div>
      </a-spin>
    </a-col>
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
  </a-row>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
export default {
  auth: false,
  async asyncData({ $axios }) {
    const data = (await $axios.get('/api/authors/')).data
    return {
      authorList: data.results,
      currentPage: 1,
      isContinuable: data.next !== null,
    }
  },
  data() {
    return {
      searchText: '',
      isLoadingSearch: false,
      isLoadingNextAuthor: false,
    }
  },
  head() {
    return {
      title: 'List of Authors',
    }
  },
  watch: {
    searchText: _.debounce(async function (value) {
      this.isLoadingSearch = true
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/authors/', {
          params: {
            filter: { first_name: this.searchText },
          },
        })
      ).data

      this.authorList = data.results
      this.currentPage = 1
      this.isContinuable = data.next !== null

      this.isLoadingSearch = false
    }, 500),
  },
  methods: {
    formatHumanDate(datetime) {
      if (datetime) {
        return moment(datetime).fromNow()
      }
    },
    goToAuthor(id) {
      this.$router.push('/authors/' + id)
    },
    async showMore() {
      if (this.isLoadingNextAuthor) {
        // To prevent multi load
        return
      }
      this.isLoadingNextAuthor = true
      this.currentPage++
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/authors/', {
          params: {
            filter: { first_name: this.searchText },
            page: this.currentPage,
          },
        })
      ).data

      data.results.forEach((x) => {
        this.authorList.push(x)
      })
      this.isContinuable = data.next !== null
      this.isLoadingNextAuthor = false
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 16px;
  .content {
    padding: 0 16px;

    .author-card {
      min-height: 300px;

      .author-name {
        margin-top: 12px;
        font-size: 16px;
        font-weight: bold;
      }

      .author-date {
        font-size: 12px;
        margin-bottom: 8px;
        font-style: italic;
      }

      .author-bio {
        font-size: 12px;
      }

      .author-article {
        font-weight: bold;
        margin-top: 8px;
      }
    }

    .show-more-ctn {
      background: aliceblue;
      width: 100%;
      height: 100px;
      cursor: pointer;
      display: flex;
      margin-top: 8px;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
