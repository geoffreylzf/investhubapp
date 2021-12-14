<template>
  <UtilAdsContainer>
    <div class="content">
      <h1 class="title">List of Followings</h1>

      <div v-for="(aut, idx) in authorList" :key="idx" class="aut-ctn">
        <nuxt-link :to="'/authors/' + aut.id">
          <a-avatar class="aut-ctn-avatar" :size="48" :src="aut.img_path" />
        </nuxt-link>
        <div class="aut-ctn-text">
          <nuxt-link class="link" :to="'/authors/' + aut.id">
            <div class="font-weight-bold">{{ aut.first_name }}</div>
            <div class="aut-ctn-bio">
              {{ aut.bio }}
            </div>
            <div class="aut-ctn-count">
              <b>{{ aut.article_count }}</b> articles
              <b>{{ aut.follower_count }}</b> followers
            </div>
            <div
              v-if="aut.current_user_support.is_support"
              class="aut-ctn-supporter"
            >
              Your support to this author remaining
              {{ aut.current_user_support.remaining_days }} days
            </div>
          </nuxt-link>
        </div>
        <AuthorFollowButton
          class="aut-ctn-follow-btn"
          :author-id="aut.id"
          :is-following="aut.is_following"
          @followed="afterFollow(aut)"
          @unfollowed="afterUnfollow(aut)"
        />
      </div>

      <div v-if="isContinuable" class="show-more-ctn" @click="showMore()">
        <span v-if="isLoadingNextArticle"><a-spin /></span>
        <span v-else>Show More <a-icon type="down" /></span>
      </div>
    </div>
  </UtilAdsContainer>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const authorData = (await $axios.get(`/api/user/profile/followings`)).data

    return {
      authorList: authorData.results,
      currentPage: 1,
      isContinuable: authorData.next !== null,
    }
  },
  data() {
    return {
      isLoadingNextAuthor: false,
    }
  },
  head() {
    return {
      title: 'List of Followings',
    }
  },
  methods: {
    async showMore() {
      if (this.isLoadingNextAuthor) {
        // To prevent multi load
        return
      }
      this.isLoadingNextAuthor = true
      this.currentPage++
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = (
        await this.$axios.get('/api/user/profile/followings/', {
          params: {
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
    afterFollow(aut) {
      aut.is_following = true
      aut.follower_count++
    },
    afterUnfollow(aut) {
      aut.is_following = false
      aut.follower_count--
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  min-height: 100%;

  .title {
    padding: 16px 16px 16px 16px;
    border-bottom: 1px solid lightgray;
    margin-bottom: 0;
  }

  .aut-ctn {
    padding: 16px;
    border-bottom: 1px solid lightgray;
    display: flex;
    align-items: center;

    .aut-ctn-avatar {
      margin-right: 12px;
      flex: 0 0 48px;
    }

    .aut-ctn-text {
      flex: 1 1 auto;
      .link {
        text-decoration: none;
        color: inherit;

        .aut-ctn-bio,
        .aut-ctn-count {
          font-size: 12px;
        }

        .aut-ctn-supporter {
          font-size: 12px;
          color: rebeccapurple;
          font-style: italic;
        }
      }
    }

    .aut-ctn-follow-btn {
      margin-left: 8px;
      flex: 0 0 100px;
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
