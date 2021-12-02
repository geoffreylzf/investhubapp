<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" />
    <a-col :xs="24" :sm="16">
      <h1>Update Article</h1>
      <a-button-group>
        <nuxt-link to="/profile/author/articles">
          <a-button icon="bars"> List All </a-button>
        </nuxt-link>
        <nuxt-link :to="`/profile/author/articles/${id}`">
          <a-button icon="eye"> View </a-button>
        </nuxt-link>
      </a-button-group>
      <br />
      <br />
      <UserAuthorArticleForm
        ref="form"
        mode="update"
        :topic-list="topicList"
        :stock-counter-list="stockCounterList"
        :data="article"
      />
      <br />
      <br />
      <a-button block type="primary" icon="save" @click="updateArticle()">
        Update
      </a-button>
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

    const topicList = (
      await $axios.get('/api/topics/', {
        params: { select: {} },
      })
    ).data

    const stockCounterList = (
      await $axios.get('/api/stock/counters/', {
        params: {
          select: {},
          fields: ['id', 'stock_symbol'],
        },
      })
    ).data
    return {
      id,
      article,
      topicList,
      stockCounterList,
    }
  },
  head() {
    return {
      title: 'Update Article',
    }
  },
  methods: {
    updateArticle() {
      const data = this.$refs.form.validate()
      if (data) {
        this.$axios
          .put(`/api/user/profile/author/articles/${this.id}/`, data)
          .then((r) => {
            this.$message.success('Update success')
            this.$router.push(`/profile/author/articles/${this.id}`)
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
