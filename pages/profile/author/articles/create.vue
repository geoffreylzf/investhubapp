<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"></a-col>
    <a-col :xs="24" :sm="16">
      <h1>Create New Article</h1>
      <nuxt-link to="/profile/author/articles">
        <a-button icon="bars"> List All </a-button>
      </nuxt-link>
      <br />
      <br />
      <UserAuthorArticleForm
        ref="form"
        mode="create"
        :topic-list="topicList"
        :stock-counter-list="stockCounterList"
      />
      <br />
      <br />
      <a-button block type="primary" icon="save" @click="createArticle()">
        Save
      </a-button>
    </a-col>
    <a-col :xs="0" :sm="4"></a-col>
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const topicList = (
      await $axios.get('/api/topics/', {
        params: { select: {} },
      })
    ).data

    const stockCounterList = (
      await $axios.get('/api/stock/counters/', {
        params: { select: {} },
      })
    ).data
    return {
      topicList,
      stockCounterList,
    }
  },
  head() {
    return {
      title: 'Create New Article',
    }
  },
  methods: {
    createArticle() {
      const data = this.$refs.form.validate()

      if (data) {
        this.$axios
          .post('/api/user/profile/author/articles/', data)
          .then((r) => {
            this.$message.success('Create success')
            this.$router.push(`/profile/author/articles/${r.data.id}`)
          })
          .catch((e) => {
            this.$responseError(e.response)
          })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 16px;
}
</style>
