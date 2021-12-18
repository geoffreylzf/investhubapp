<template>
  <UtilAdsContainer>
    <a-row>
      <a-col :md="24" :lg="18" class="content">
        <h1>
          {{ article.article_title }}
        </h1>
        <div class="wrote-date">
          {{ `Published at ${formatHumanDate(article.created_at)}` }}
          {{ `Viewed ${article.view_count} times` }}
        </div>
        <div
          v-for="para in article.paragraphs"
          :key="para.id"
          class="paragraph"
          :class="{
            'supporter-view': para.is_supporter_view_only,
          }"
        >
          <div v-if="para.type === 'text'">
            <pre v-if="para.content">{{ para.content }}</pre>
            <div v-else-if="para.is_supporter_view_only" class="hidden-content">
              <a-icon type="picture" />
              <span>Supporter Content</span>
            </div>
          </div>
          <div v-else-if="para.type === 'image'">
            <img v-if="para.article_img_path" :src="para.article_img_path" />
            <div v-else-if="para.is_supporter_view_only" class="hidden-content">
              <a-icon type="align-left" />
              <span>Supporter Content</span>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <a-tag v-for="t in article.topics" :key="t.id" color="blue">
            {{ t.topic_name }}
          </a-tag>
        </div>
        <div class="mt-8">
          <a-tag
            v-for="sc in article.stock_counters"
            :key="sc.id"
            color="purple"
          >
            {{ sc.stock_symbol }}
          </a-tag>
        </div>

        <div class="sponsor">
          <a-divider />
          <div>
            If you manage to get a nice profit from reading this article, why
            don't you sponsor a bit to support <b>{{ author.first_name }}</b>
          </div>
          <div class="mb-4">
            如果您通过阅读这篇文章获得了不错的收益，为什么不赞助一点来支持
            <b>{{ author.first_name }}</b>
          </div>
          <SponsorPaypalButton @click="showSponsorModal('paypal')" />
          <SponsorAmountModal
            :show="sponsorModal.isShow"
            :payment-type="sponsorModal.type"
            :article-id="id"
            :author-name="author.first_name"
            @cancel="sponsorModal.isShow = false"
            @success="sponsorSuccess()"
          />
          <div v-if="article.current_user_sponsor.is_sponsor" class="note">
            * You sponsored this article at
            {{ article.current_user_sponsor.last_date }}
          </div>
          <a-divider />
        </div>

        <div>
          <div class="font-weight-bold">Comments</div>
          <a-textarea
            v-model="newComment"
            class="mb-12"
            auto-size
            placeholder="Enter comment"
            @focus="checkAuthBeforeComment()"
          />
          <div class="text-right">
            <a-button
              :disabled="newComment.length === 0"
              @click="postComment()"
            >
              Comment
            </a-button>
          </div>
        </div>

        <ArticleCommentPanel
          ref="commentPanel"
          :article-id="id"
          :article-author-user-id="author.user"
        />
      </a-col>
      <a-col :md="24" :lg="6" class="author-section">
        <a-card class="card">
          <div class="text-center">
            <nuxt-link :to="'/authors/' + author.id" class="link">
              <a-avatar :size="64" :src="author.img_path" />
              <div class="name">{{ author.first_name }}</div>
            </nuxt-link>
            <div class="bio">{{ author.bio }}</div>
            <AuthorFollowButton
              :author-id="author.id"
              :is-following="author.is_following"
              @followed="afterFollow()"
              @unfollowed="afterUnfollow()"
            />
          </div>
        </a-card>

        <div v-if="author.current_user_support.is_support" class="supporter">
          You are supporter of <b>{{ author.first_name }}</b>
          <table>
            <tbody>
              <tr>
                <td>Last Support Date</td>
                <td class="text-right">
                  {{ author.current_user_support.last_date }}
                </td>
              </tr>
              <tr>
                <td>Remaining Support Day</td>
                <td class="text-right">
                  {{ author.current_user_support.remaining_days }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="other-articles">
          Other articles by this author:
          <div v-for="(oa, idx) in otherNewArticles" :key="oa.id" class="mb-8">
            {{ idx + 1 }}.
            <nuxt-link :to="'/articles/' + oa.id">
              {{ oa.article_title }}
            </nuxt-link>
          </div>
          <a-skeleton active :loading="isFetchingOtherNewArticles" />
        </div>
      </a-col>
    </a-row>
  </UtilAdsContainer>
</template>

<script>
import moment from 'moment'
export default {
  auth: false,
  async asyncData({ params, $axios }) {
    const id = parseInt(params.id)
    const article = (await $axios.get(`/api/articles/${id}`)).data
    const author = article.author
    return {
      id,
      article,
      author,
    }
  },
  data() {
    return {
      otherNewArticles: [],
      isFetchingOtherNewArticles: true,

      sponsorModal: {
        isShow: false,
        type: null,
      },

      newComment: '',
    }
  },
  head() {
    return {
      title: this.article.article_title,
    }
  },
  async mounted() {
    const authorId = this.author.id
    this.otherNewArticles = (
      await this.$axios.get(`/api/authors/${authorId}/articles`, {
        params: {
          select: { size: 5 },
          filter: {
            $_exclude_article_id: this.id,
          },
        },
      })
    ).data
    this.isFetchingOtherNewArticles = false

    await this.$axios.post(`/api/articles/${this.id}/view/`)
  },
  methods: {
    formatHumanDate(datetime) {
      if (datetime) {
        return moment(datetime).fromNow()
      }
    },
    showSponsorModal(type) {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
        return
      }

      this.sponsorModal.type = type
      this.sponsorModal.isShow = true
    },
    async sponsorSuccess() {
      this.sponsorModal.isShow = false
      this.$notification.success({
        message: 'Thank you for your sponsor / 谢谢你的支持',
      })
      await this.$nuxt.refresh()
    },
    afterFollow() {
      this.author.is_following = true
    },
    afterUnfollow() {
      this.author.is_following = false
    },
    checkAuthBeforeComment() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
      }
    },
    async postComment() {
      const comment = this.newComment
      const artId = this.id
      if (comment) {
        try {
          await this.$axios.post(`/api/articles/${artId}/comments/`, {
            content: comment,
          })

          this.newComment = ''
          this.$refs.commentPanel.refresh()
        } catch (e) {
          this.$responseError(e.response)
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 16px;

  .wrote-date {
    font-size: 12px;
    font-style: italic;
    margin-bottom: 8px;
  }

  .paragraph {
    margin-bottom: 16px;

    &.supporter-view {
      border-left: 2px mediumpurple solid;
      padding-left: 8px;
    }

    pre {
      font-family: 'Roboto', 'Open Sans', sans-serif;
      white-space: pre-line;
    }

    img {
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
    }

    .hidden-content {
      background: whitesmoke;
      color: lightgray;
      height: 84px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        margin-left: 8px;
      }
    }
  }

  .sponsor {
    .note {
      font-size: 12px;
      color: rebeccapurple;
      font-style: italic;
    }
  }
}

.author-section {
  padding: 16px;

  .card {
    margin-bottom: 16px;

    .link {
      text-decoration: none;
      color: inherit;

      .name {
        margin-top: 16px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 16px;
      }
    }

    .bio {
      font-size: 12px;
      margin-bottom: 4px;
    }
  }

  .supporter {
    margin-bottom: 16px;
    background: aliceblue;
    color: steelblue;
    padding: 8px 16px;
    font-size: 12px;

    table {
      width: 100%;
    }
  }

  .other-articles {
    padding: 0 16px;
  }
}
</style>
