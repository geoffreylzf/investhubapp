<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"> Advertisement</a-col>
    <a-col :xs="24" :sm="16" class="content">
      <p class="title">List of Articles</p>
      <a-input placeholder="Search..." class="search" />

      <a-list bordered :data-source="articles">
        <a-list-item slot="renderItem" slot-scope="art">
          <nuxt-link :to="'articles/' + art.id">
            {{ art.title }}
          </nuxt-link>
        </a-list-item>
      </a-list>
    </a-col>
    <a-col :xs="0" :sm="4"> Advertisement </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      articles: [
        {
          id: 1,
          title: 'Kpower 的浅层分析',
          author: '和狼瓜子',
          create_date: '2021-04-08 14:20:34',
        },
        {
          id: 2,
          title: 'CCM 手套原料需求增加受益的公司',
          author: 'koko888',
          create_date: '2021-04-08 12:20:34',
        },
      ],
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  padding: 16px;
}

.content {
  padding: 0 16px;
}

.title {
  letter-spacing: 2px;
  font-size: 24px;
  font-weight: bolder;
}
.search {
  margin-bottom: 12px;
}
</style>
