<template>
  <div class="panel">
    <div class="panel-title">New Joined Author</div>
    <a-skeleton v-if="isMounting" class="skeleton" />
    <div v-else class="content">
      <nuxt-link
        v-for="(aut, i) in authorList"
        :key="i"
        class="link"
        :to="'/authors/' + aut.id"
      >
        <div class="author">
          <a-avatar class="avatar" :size="48" :src="aut.img_path" />
          <div>
            <div class="name">{{ aut.display_name }}</div>
            <div class="join-date">
              First article published at
              {{
                $formatHumanDate(aut.first_article_publish_datetime, {
                  uppercaseFirstChar: false,
                })
              }}
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authorList: [],
      isMounting: true,
    }
  },
  async mounted() {
    this.authorList = (await this.$axios.get('/api/home/newest-authors/')).data
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

  .link {
    text-decoration: none;
    color: inherit;
    .author {
      margin: 4px 12px 8px 12px;
      display: flex;
      align-items: center;

      .avatar {
        margin-right: 8px;
      }

      .name {
        font-weight: bold;
      }
      .join-date {
        font-style: italic;
        font-size: 12px;
      }
    }
  }
}
</style>
