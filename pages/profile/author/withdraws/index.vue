<template>
  <a-row class="m-16">
    <a-col :sm="0" :md="4" />
    <a-col :sm="24" :md="16">
      <h1>Your Withdraws History</h1>
      <nuxt-link to="/profile/author/withdraws/create">
        <a-button icon="plus"> Submit New Withdraw </a-button>
      </nuxt-link>
      <UtilFilterTable
        get-url="/api/user/profile/author/withdraws/"
        :columns="columns"
        :init-data="initData"
      >
        <template #amt="{ rowData }">
          <nuxt-link :to="`/profile/author/withdraws/${rowData.id}`">
            {{ $formatNumber(rowData.amt) }}
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
      initData: (await $axios.get('/api/user/profile/author/withdraws/')).data,
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
          title: 'Withdraw Date',
          dataIndex: 'withdraw_date',
          width: '120px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
        },
        {
          title: 'Amt',
          dataIndex: 'amt',
          bodyClass: 'text-right',
          width: '100px',
          sorter: true,
          scopedSlot: 'amt',
        },
        {
          title: 'Author Remark',
          dataIndex: 'author_remark',
          filter: true,
        },
        {
          title: 'Flow Status',
          dataIndex: 'flow_status_desc',
          width: '150px',
          bodyClass: 'text-center',
          filter: true,
          sorter: true,
        },
        {
          title: 'System Remark',
          dataIndex: 'system_remark',
          filter: true,
        },
        {
          title: 'Reference No',
          dataIndex: 'reference_no',
          filter: true,
        },
      ],
    }
  },
  head() {
    return {
      title: 'Your Withdraws History',
    }
  },
}
</script>
