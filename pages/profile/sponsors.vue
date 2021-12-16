<template>
  <a-row class="m-16">
    <a-col :sm="0" :md="4" />
    <a-col :sm="24" :md="16">
      <h1>Your Sponsors History</h1>
      <UtilFilterTable
        get-url="/api/user/profile/sponsors/"
        :columns="columns"
        :init-data="initData"
      >
        <template #articleTitle="{ rowData }">
          <nuxt-link :to="`/articles/${rowData.article}`">
            {{ rowData.article_title }}
          </nuxt-link>
        </template>

        <template #author="{ rowData }">
          <nuxt-link :to="`/articles/${rowData.author}`">
            {{ rowData.author_first_name }}
          </nuxt-link>
        </template>
      </UtilFilterTable>
    </a-col>
    <a-col :sm="0" :md="4" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    return {
      initData: (await $axios.get('/api/user/profile/sponsors/')).data,
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
          title: 'Sponsor Date',
          dataIndex: 'sponsor_date',
          width: '120px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
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
          dataIndex: 'article_is_publish',
          bodyClass: 'text-center',
          width: '80px',
          isBoolean: true,
          filter: true,
          sorter: true,
        },
        {
          title: 'Author',
          dataIndex: 'author_first_name',
          width: '150px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
          scopedSlot: 'author',
        },
        {
          title: 'Amt',
          dataIndex: 'amt',
          width: '80px',
          decimal: 2,
          bodyClass: 'text-right',
          sorter: true,
        },
        {
          title: 'Type',
          dataIndex: 'payment_type',
          width: '80px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
        },
      ],
    }
  },
  head() {
    return {
      title: 'Your Sponsors History',
    }
  },
}
</script>
