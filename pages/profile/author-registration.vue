<template>
  <a-row class="container">
    <a-col :xs="0" :lg="8" />
    <a-col :xs="24" :sm="8" class="content">
      <h1>Author Registration</h1>
      <div>
        {{ profile }}
      </div>
    </a-col>
    <a-col :xs="0" :lg="8" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios, redirect }) {
    const profile = (await $axios.get(`/api/user/profile/`)).data.profile
    if (profile.is_author) {
      redirect('/profile')
    }
    return {
      profile,
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  padding: 16px;
}
</style>
