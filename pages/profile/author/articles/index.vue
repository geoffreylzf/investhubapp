<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"></a-col>
    <a-col :xs="24" :sm="16">
      <h1>Your Articles</h1>
      <nuxt-link to="/profile/author/articles/create">
        <a-button icon="plus">Create</a-button>
      </nuxt-link>
      <UtilFilterTable
        get-url="/api/user/profile/author/articles/"
        :columns="columns"
        :init-data="initData"
      >
        <template #articleTitle="{ rowData }">
          <nuxt-link :to="`/profile/author/articles/${rowData.id}`">
            {{ rowData.article_title }}
          </nuxt-link>
        </template>

        <template #action="{ rowData }">
          <nuxt-link :to="`/profile/author/articles/${rowData.id}`">
            <a-icon type="eye" />
          </nuxt-link>
          <span>&nbsp;</span>
          <nuxt-link :to="`/profile/author/articles/${rowData.id}/update`">
            <a-icon type="edit" />
          </nuxt-link>
        </template>
      </UtilFilterTable>
    </a-col>
    <a-col :xs="0" :sm="4"></a-col>
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    return {
      initData: (await $axios.get('/api/user/profile/author/articles/')).data,
    }
  },
  data() {
    return {
      columns: [
        {
          title: '#',
          isIndex: true,
          width: '36px',
          bodyClass: 'text-center',
        },
        {
          title: 'Article Title',
          dataIndex: 'article_title',
          filter: true,
          sorter: true,
          scopedSlot: 'articleTitle',
        },
        {
          title: 'Publish',
          dataIndex: 'is_publish',
          bodyClass: 'text-center',
          width: '100px',
          isBoolean: true,
          filter: true,
          sorter: true,
        },
        {
          title: 'Created At',
          dataIndex: 'created_at',
          width: '150px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
        },
        {
          title: 'Updated At',
          dataIndex: 'updated_at',
          width: '150px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
        },
        {
          title: 'Action',
          width: '80px',
          bodyClass: 'text-center',
          scopedSlot: 'action',
        },
      ],
    }
  },
  head() {
    return {
      title: 'Your Articles',
    }
  },
}
</script>
<style lang="less" scoped>
.container {
  padding: 16px;
}
</style>
