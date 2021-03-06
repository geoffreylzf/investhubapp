<template>
  <UtilAdsContainer>
    <div class="content">
      <div class="author-section">
        <div class="avatar">
          <a-avatar :size="84" :src="author.img_path" />
          <div v-if="author.current_user_support.is_support" class="supporter">
            Your support to this author remaining
            {{ author.current_user_support.remaining_days }} days
          </div>
        </div>
        <div class="name">
          <div>
            {{ author.display_name }}
          </div>
          <div>
            <AuthorFollowButton
              :author-id="id"
              :is-following="author.is_following"
              @followed="afterFollow()"
              @unfollowed="afterUnfollow()"
            />
          </div>
        </div>
        <div class="bio">
          {{ author.bio }}
        </div>
        <div class="join-date">
          Joined
          {{
            $formatHumanDate(author.created_at, { uppercaseFirstChar: false })
          }}
        </div>
        <div class="follower">
          <b>{{ author.article_count }}</b> articles
          <b>{{ author.follower_count }}</b> followers
        </div>
      </div>
      <div class="article-section">
        <div class="section-title">List of Article</div>
        <nuxt-link
          v-for="(art, idx) in articleList"
          :key="idx"
          class="link"
          :to="'/articles/' + art.id"
        >
          <a-card class="article-card" hoverable>
            <div class="article-ctn">
              <div class="title">{{ art.article_title }}</div>
              <div class="wrote-date">
                {{ $formatHumanDate(art.publish_datetime) }}
              </div>
              <div class="mt-4">
                <a-tag v-for="t in art.topics" :key="t.id" color="blue">
                  {{ t.topic_name }}
                </a-tag>
              </div>
              <div class="mt-4">
                <a-tag
                  v-for="sc in art.stock_counters"
                  :key="sc.id"
                  color="purple"
                >
                  {{ sc.stock_symbol }}
                </a-tag>
              </div>
              <div class="comment">
                <b>{{ art.comment_count }}</b> comments
                <b>{{ art.view_count }}</b> views
              </div>
            </div>
          </a-card>
        </nuxt-link>
        <div
          v-if="isArticleContinuable"
          class="show-more-ctn"
          @click="showMore()"
        >
          <span v-if="isLoadingNextArticle"><a-spin /></span>
          <span v-else>Show More <a-icon type="down" /></span>
        </div>
      </div>
    </div>
  </UtilAdsContainer>
</template>

<script>
export default {
  auth: false,
  async asyncData({ params, $axios }) {
    const id = parseInt(params.id)
    const author = (await $axios.get(`/api/authors/${id}`)).data
    const articleData = (await $axios.get(`/api/authors/${id}/articles`)).data

    return {
      id,
      author,
      articleList: articleData.results,
      articleCurrentPage: 1,
      isArticleContinuable: articleData.next !== null,
    }
  },
  data() {
    return {
      isLoadingNextArticle: false,
    }
  },
  head() {
    return {
      title: this.author.display_name,
    }
  },
  methods: {
    afterFollow() {
      this.author.is_following = true
      this.author.follower_count++
    },
    afterUnfollow() {
      this.author.is_following = false
      this.author.follower_count--
    },
    async showMore() {
      if (this.isLoadingNextArticle) {
        // To prevent multi load
        return
      }
      this.isLoadingNextArticle = true
      this.articleCurrentPage++
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get(`/api/authors/${this.id}/articles`, {
          params: {
            filter: { article_title: this.searchText },
            page: this.articleCurrentPage,
          },
        })
      ).data

      data.results.forEach((x) => {
        this.articleList.push(x)
      })

      this.isArticleContinuable = data.next !== null
      this.isLoadingNextArticle = false
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  min-height: 100%;

  .author-section {
    padding: 16px;
    border-left: 1px solid lightgray;
    border-right: 1px solid lightgray;

    .avatar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .supporter {
        font-size: 12px;
        color: rebeccapurple;
        font-style: italic;
      }
    }
    .name {
      margin: 4px 0;
      font-weight: bold;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .join-date {
      font-size: 12px;
      font-style: italic;
    }
  }

  .article-section {
    border-top: 1px solid lightgray;

    .section-title {
      font-weight: bold;
      color: mediumpurple;
      padding: 4px 16px;
      border-bottom: 1px solid lightgray;
      border-left: 1px solid lightgray;
      border-right: 1px solid lightgray;
    }

    .link {
      text-decoration: none;
      color: inherit;

      .article-card {
        margin: 16px;

        ::v-deep .ant-card-body {
          padding: 0;
          .article-ctn {
            padding: 16px;
            cursor: pointer;

            .title {
              font-weight: bold;
              font-size: 16px;
            }
            .wrote-date {
              font-size: 12px;
              font-style: italic;
            }
            .comment {
              font-size: 12px;
            }
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
}
</style>
