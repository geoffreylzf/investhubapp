<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" />
    <a-col :xs="24" :sm="12" class="content">
      <h1>
        {{ article.article_title }}
        <a-tag v-if="article.is_publish" color="green"> Publish </a-tag>
        <a-tag v-else color="red"> Not Yet Publish </a-tag>
      </h1>
      <p>
        <i>Created at {{ article.created_at }}</i>
        &nbsp;
        <i>Last updated at {{ article.updated_at }}</i>
      </p>
      <a-button-group>
        <nuxt-link to="/profile/author/articles">
          <a-button icon="bars"> List All </a-button>
        </nuxt-link>
        <nuxt-link :to="`/profile/author/articles/${id}/update`">
          <a-button icon="edit"> Update </a-button>
        </nuxt-link>
      </a-button-group>
      <br />
      <br />
      <div
        v-for="(para, i) in article.paragraphs"
        :key="i"
        class="paragraph"
        :class="{
          'supporter-view': para.is_supporter_view_only,
          'public-view': !para.is_supporter_view_only,
        }"
      >
        <pre v-if="para.type === 'text'">{{ para.content }}</pre>
        <img v-else-if="para.type === 'image'" :src="para.article_img_path" />
      </div>
      <div>
        <a-tag v-for="t in article.topics" :key="t.id" color="blue">
          {{ t.topic_name }}
        </a-tag>
      </div>
      <br />
      <div>
        <a-tag v-for="sc in article.stock_counters" :key="sc.id" color="purple">
          {{ sc.stock_symbol }}
        </a-tag>
      </div>
    </a-col>
    <a-col :xs="24" :sm="4" class="status">
      <a-statistic title="View Count" :value="0" />
      <a-statistic title="Comment Count" :value="0" />
      <a-statistic title="Sponsor Count" :value="0" />
      <a-statistic title="Sponsor Amount" :precision="2" :value="0" />
    </a-col>
    <a-col :xs="0" :sm="4" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const id = parseInt(params.id)
    const article = (
      await $axios.get(`/api/user/profile/author/articles/${id}`)
    ).data
    return {
      id,
      article,
    }
  },
  head() {
    return {
      title: 'View ' + this.article.article_title,
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 16px;
  .status {
    margin: 16px;
  }

  .paragraph {
    margin-bottom: 16px;
    padding-left: 4px;

    &.supporter-view {
      border-left: 4px darkseagreen solid;
    }

    &.public-view {
      border-left: 4px white solid;
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
  }
}
</style>
