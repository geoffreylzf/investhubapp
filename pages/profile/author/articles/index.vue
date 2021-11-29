<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"></a-col>
    <a-col :xs="24" :sm="16">
      <h1>Your Articles</h1>
      <nuxt-link to="/profile/author/articles/create">
        <a-button icon="plus">Create</a-button>
      </nuxt-link>
    </a-col>
    <a-col :xs="0" :sm="4"></a-col>
  </a-row>
</template>

<script>
export default {}
</script>
<style lang="less" scoped>
.container {
  padding: 16px;
}
</style>
