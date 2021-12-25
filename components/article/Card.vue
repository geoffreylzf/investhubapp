<template>
  <nuxt-link class="link" :to="'/articles/' + articleData.id">
    <a-card class="art-card" hoverable>
      <div class="art-ctn">
        <a-avatar
          class="art-ctn-avatar"
          :size="48"
          :src="articleData.author_img_path"
        />
        <div>
          <div class="font-weight-bold">{{ articleData.article_title }}</div>
          <div class="art-ctn-desc">
            {{
              articleData.author_display_name +
              '. ' +
              $formatHumanDate(articleData.publish_datetime)
            }}
          </div>
          <div class="mt-8">
            <a-tag v-for="t in articleData.topics" :key="t.id" color="blue">
              {{ t.topic_name }}
            </a-tag>
          </div>
          <div class="mt-8">
            <a-tag
              v-for="sc in articleData.stock_counters"
              :key="sc.id"
              color="purple"
            >
              {{ sc.stock_symbol }}
            </a-tag>
          </div>
          <div class="art-ctn-comment mt-8">
            <b>{{ articleData.comment_count }}</b> comments
            <b>{{ articleData.view_count }}</b> views
          </div>
        </div>
      </div>
    </a-card>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    articleData: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.art-card {
  ::v-deep .ant-card-body {
    padding: 0;

    .art-ctn {
      padding: 16px;
      display: flex;
      cursor: pointer;

      .art-ctn-avatar {
        margin-right: 12px;
        flex: 0 0 48px;
      }

      .art-ctn-desc {
        font-size: 12px;
      }

      .art-ctn-comment {
        font-size: 12px;
      }
    }
  }
}
</style>
