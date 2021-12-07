<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
    <a-col :xs="24" :sm="12" class="content">
      <h1>
        {{ article.article_title }}
      </h1>
      <div v-for="para in article.paragraphs" :key="para.id" class="paragraph">
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
      <a-divider />
      Support this article by:
      <br />
      <a-button type="primary"> Paypal </a-button>
      <a-divider />
      <div class="font-weight-bold">Comments</div>
      <a-textarea
        v-model="newComment"
        class="mb-12"
        autosize
        placeholder="Enter comment"
        @focus="checkAuthBeforeComment()"
      />
      <div class="text-right">
        <a-button :disabled="newComment.length === 0" @click="postComment()">
          Comment
        </a-button>
      </div>

      <ArticleCommentPanel
        ref="commentPanel"
        :article-id="id"
        :user-id="article.user"
      />
    </a-col>
    <a-col :xs="24" :sm="4" class="author-profile">
      <nuxt-link :to="'/authors/' + article.author">
        <a-card hoverable>
          <div class="text-center">
            <a-avatar :size="64" :src="article.author_img_path" />
            <div class="author-name">{{ article.author_first_name }}</div>
            <div class="author-bio">{{ article.author_bio }}</div>
          </div>
        </a-card>
      </nuxt-link>
      <br />
      <div class="author-other-articles">
        Other Articles by this author:
        <div v-for="(oa, idx) in otherNewArticles" :key="oa.id" class="mb-8">
          {{ idx + 1 }}.
          <nuxt-link :to="'/articles/' + oa.id">
            {{ oa.article_title }}
          </nuxt-link>
        </div>
        <a-skeleton active :loading="isFetchingOtherNewArticles" />
      </div>
    </a-col>
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
  </a-row>
</template>

<script>
export default {
  auth: false,
  async asyncData({ params, $axios }) {
    const id = parseInt(params.id)
    const article = (await $axios.get(`/api/articles/${id}`)).data
    return {
      id,
      article,
    }
  },
  data() {
    return {
      otherNewArticles: [],
      isFetchingOtherNewArticles: true,

      newComment: '',
    }
  },
  head() {
    return {
      title: this.article.article_title,
    }
  },
  async mounted() {
    const authorId = this.article.author
    this.otherNewArticles = (
      await this.$axios.get(`/api/authors/${authorId}/new-articles`, {
        params: {
          select: { size: 5 },
          filter: {
            $_exclude_article_id: this.id,
          },
        },
      })
    ).data
    this.isFetchingOtherNewArticles = false
  },
  methods: {
    checkAuthBeforeComment() {
      if (!this.$auth.loggedIn) {
        // TODO pop modal to login
        this.$router.push('/login')
      }
    },
    async postComment() {
      const comment = this.newComment
      const artId = this.id
      if (comment) {
        await this.$axios.post(`/api/articles/${artId}/comments/`, {
          content: comment,
        })

        this.newComment = ''
        this.$refs.commentPanel.refresh()
      }
    },
  },
}
</script>
<style lang="less" scoped>
.container {
  padding: 16px;
}

.content {
  padding: 0 16px;

  .paragraph {
    margin-bottom: 16px;

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
}

.author-profile {
  padding-right: 16px;
}
.author-name {
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.author-bio {
  font-size: 12px;
}
.author-other-articles {
  padding: 0 16px;
}
</style>
