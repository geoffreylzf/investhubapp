<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" />
    <a-col :xs="24" :sm="12" class="content">
      <h1>
        {{ data.article_title }}
        <a-tag v-if="data.is_publish" color="green"> Publish </a-tag>
        <a-tag v-else color="red"> Not Yet Publish </a-tag>
      </h1>
      <p>
        <i>Created at {{ data.created_at }}</i>
        &nbsp;
        <i>Last updated at {{ data.created_at }}</i>
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
      <div v-for="(para, i) in data.paragraphs" :key="i" class="paragraph">
        {{ para.content }}
      </div>
    </a-col>
    <a-col :xs="24" :sm="4" class="status">
      <a-statistic title="View Count" :value="0" />
      <a-statistic title="Donate Count" :value="0" />
      <a-statistic title="Donate Amount" :precision="2" :value="0" />
    </a-col>
    <a-col :xs="0" :sm="4" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const id = parseInt(params.id)
    const data = (await $axios.get(`/api/user/profile/author/articles/${id}`))
      .data
    return {
      id,
      data,
    }
  },
  head() {
    return {
      title: 'View ' + this.data.article_title,
    }
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 16px;
  .status {
    margin-left: 16px;
  }

  .paragraph {
    margin-bottom: 16px;
  }
}
</style>
