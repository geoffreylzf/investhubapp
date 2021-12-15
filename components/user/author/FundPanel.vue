<template>
  <div v-if="fundData">
    <a-statistic
      title="Your Available Fund (RM) From Sponsor"
      :value="fundData.available_fund"
      :precision="2"
      class="mb-16"
    />
    <a-statistic
      class="mb-16"
      title="Pending Withdraw Fund (RM)"
      :value="fundData.pending_withdraw"
      :precision="2"
    />
    <a-button-group>
      <nuxt-link to="/profile/author/withdraws/create">
        <a-button> Submit New Withdraw </a-button>
      </nuxt-link>
      <nuxt-link to="/profile/author/withdraws">
        <a-button> Manage Your Withdraw </a-button>
      </nuxt-link>
    </a-button-group>
  </div>
  <a-skeleton v-else active />
</template>

<script>
export default {
  data() {
    return {
      fundData: null,
    }
  },
  async mounted() {
    this.fundData = (
      await this.$axios.get(`/api/user/profile/author/fund/`)
    ).data
  },
}
</script>
