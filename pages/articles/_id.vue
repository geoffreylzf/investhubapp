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
      <div class="comment-title">Comments</div>
      <a-textarea class="comment-textarea" placeholder="Enter comment">
      </a-textarea>
      <div v-for="cmt in comments" :key="'c_' + cmt.id">
        <div class="comment-user-name">{{ cmt.user_firstname }}</div>
        <div class="comment-user-content">{{ cmt.comment }}</div>
      </div>
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
      comments: [
        {
          id: 1,
          user: 1,
          user_firstname: 'Jack',
          comment: 'very good',
        },
        {
          id: 2,
          user_firstname: 'Nathan',

          comment: 'very nice',
        },
      ],
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
    padding-left: 4px;

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

.comment-title {
  font-weight: bold;
}

.comment-textarea {
  margin-bottom: 12px;
}
.comment-user-name {
  font-size: 12px;
  font-weight: bold;
}

.comment-user-content {
  margin-bottom: 8px;
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
