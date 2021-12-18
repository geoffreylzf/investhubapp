<template>
  <div class="panel">
    <div class="panel-title">Newest Articles</div>
    <a-skeleton v-if="isMounting" class="skeleton" />
    <div v-else class="content">
      <div v-for="(art, i) in articleList" :key="i" class="article">
        <nuxt-link :to="'/articles/' + art.id">
          <p class="title">{{ i + 1 }}. {{ art.title }}</p>
        </nuxt-link>
        <p class="author">
          {{ art.author_first_name }}.
          {{ $formatHumanDate(art.publish_datetime) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articleList: [],
      isMounting: true,
    }
  },
  async mounted() {
    this.articleList = (
      await this.$axios.get('/api/home/newest-articles/')
    ).data
    this.isMounting = false
  },
}
</script>

<style lang="less" scoped>
.panel {
  border: 1px solid purple;

  .panel-title {
    background: linear-gradient(to right, purple, violet);
    height: 32px;
    line-height: 16px;
    margin: 4px;
    padding: 8px 12px;
    color: white;
    font-size: 14px;
  }

  .skeleton {
    padding: 4px 12px 0 12px;
  }

  .content {
    overflow-y: auto;
    max-height: calc(100% - 44px);
    scrollbar-width: none;
    margin-bottom: 4px;
  }
  .content::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  .article {
    margin: 4px 12px 0 12px;
    .title {
      color: cornflowerblue;
      font-weight: bold;
      margin: 0;
      font-size: 14px;
    }
    .datetime {
      margin: 0;
      font-size: 11px;
      font-family: Helvetica, Arial, Verdana, Tahoma, sans-serif;
      color: grey;
    }
    .author {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.75);
      margin-bottom: 4px;
    }
  }
}
</style>
