<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" />
    <a-col :xs="24" :sm="12" class="content">
      <h1>
        {{ article.article_title }}
        <a-tag v-if="article.is_publish" color="green"> Publish </a-tag>
        <a-tag v-else color="red"> Not Yet Publish </a-tag>
      </h1>
      <p class="cu-date">
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
        }"
      >
        <pre v-if="para.type === 'text'">{{ para.content }}</pre>
        <img v-else-if="para.type === 'image'" :src="para.article_img_path" />
      </div>
      <div class="mt-8">
        <a-tag v-for="t in article.topics" :key="t.id" color="blue">
          {{ t.topic_name }}
        </a-tag>
      </div>
      <div class="mt-8">
        <a-tag v-for="sc in article.stock_counters" :key="sc.id" color="purple">
          {{ sc.stock_symbol }}
        </a-tag>
      </div>
    </a-col>
    <a-col :xs="24" :sm="0">
      <a-divider />
    </a-col>
    <a-col :xs="24" :sm="4" class="status">
      <a-skeleton active :loading="isFetchingStatistics" />
      <div v-if="statisticData">
        <a-statistic title="View Count" :value="statisticData.view_count" />
        <a-statistic
          title="Comment Count"
          :value="statisticData.comment_count"
        />
        <a-statistic
          title="Sponsor Count"
          :value="statisticData.sponsor_count"
        />
        <a-statistic
          title="Sponsor Amount (RM)"
          :precision="2"
          :value="statisticData.sponsor_amt"
        />
      </div>
      <nuxt-link :to="`/articles/${id}`">
        <a-button class="mt-16">Go to Article Public Page</a-button>
      </nuxt-link>
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
  data() {
    return {
      statisticData: null,
      isFetchingStatistics: true,
    }
  },
  head() {
    return {
      title: 'View ' + this.article.article_title,
    }
  },
  async mounted() {
    this.statisticData = (
      await this.$axios.get(
        `/api/user/profile/author/articles/${this.id}/statistics`
      )
    ).data
    this.isFetchingStatistics = false
  },
}
</script>

<style lang="less" scoped>
.container {
  .content {
    padding: 16px;

    .cu-date {
      font-size: 12px;
    }

    .paragraph {
      margin-bottom: 16px;

      &.supporter-view {
        border-left: 2px darkseagreen solid;
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
    }
  }
  .status {
    padding: 16px;
  }
}
</style>
