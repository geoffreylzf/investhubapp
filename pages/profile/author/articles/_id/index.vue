<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" />
    <a-col :xs="24" :sm="12" class="content">
      <h1>
        {{ article.article_title }}
        <a-tag v-if="article.is_publish" color="green"> Publish </a-tag>
        <a-tag v-else color="red"> Not Yet Publish </a-tag>
      </h1>
      <a-button-group class="mb-16">
        <nuxt-link to="/profile/author/articles">
          <a-button icon="bars"> List All </a-button>
        </nuxt-link>
        <nuxt-link :to="`/profile/author/articles/${id}/update`">
          <a-button icon="edit"> Update </a-button>
        </nuxt-link>
      </a-button-group>
      <div
        v-for="(para, i) in article.paragraphs"
        :key="i"
        class="paragraph"
        :class="{
          'supporter-view': para.is_supporter_view_only,
        }"
      >
        <h3>{{ para.paragraph_title }}</h3>
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
      <div class="mb-16">
        <div class="title">Create At</div>
        <div class="value">
          {{ $formatHumanDate(article.created_at) }}
          <span class="note">({{ article.created_at }})</span>
        </div>
        <div class="title">Updated At</div>
        <div v-if="article.updated_at" class="value">
          {{ $formatHumanDate(article.updated_at) }}
          <span class="note">({{ article.updated_at }})</span>
        </div>
        <div v-else>-</div>
        <div class="title">Publish At</div>
        <div v-if="article.publish_datetime" class="value">
          {{ $formatHumanDate(article.publish_datetime) }}
          <span class="note">({{ article.publish_datetime }})</span>
        </div>
        <div v-else>-</div>
      </div>
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

    .title {
      color: darkgray;
      font-size: 12px;
    }
    .value {
      margin-bottom: 4px;
    }
    .note {
      font-size: 12px;
    }
  }
}
</style>
