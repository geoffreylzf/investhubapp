<template>
  <a-row class="m-16">
    <a-col :sm="0" :md="4" />
    <a-col :sm="24" :md="16">
      <h1>Submit New Withdraw</h1>
      <nuxt-link to="/profile/author/withdraws">
        <a-button icon="bars">Withdraw History</a-button>
      </nuxt-link>

      <a-statistic
        title="Your Available Withdraw Fund (RM)"
        :value="fundData.available_fund"
        :precision="2"
        class="mt-24"
      />

      <a-alert
        v-if="isFundNotAvailableToWithdraw"
        message="You available fund is below RM100, you can't make withdraw"
        type="error"
        show-icon
        class="mt-8"
      />

      <UserAuthorWithdrawForm ref="form" mode="create" class="mt-24" />
      <a-button
        block
        type="primary"
        icon="save"
        class="mt-16"
        :disabled="isFundNotAvailableToWithdraw"
        :loading="isSaving"
        @click="create()"
      >
        Create
      </a-button>
    </a-col>
    <a-col :sm="0" :md="4" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    return {
      fundData: (await $axios.get(`/api/user/profile/author/fund/`)).data,
    }
  },
  data() {
    return {
      isSaving: false,
    }
  },
  computed: {
    isFundNotAvailableToWithdraw() {
      return this.fundData.available_fund < 100
    },
  },
  methods: {
    create() {
      if (this.isFundNotAvailableToWithdraw) {
        this.$error({
          title: 'Your available fund is not allowed to make withdraw',
        })
        return
      }

      const data = this.$refs.form.validate()
      if (data) {
        if (data.amt > this.fundData.available_fund) {
          this.$error({
            title: 'Withdraw amount is more than available fund',
          })
          return
        }

        if (data.amt < 100) {
          this.$error({
            title: 'Withdraw lowest limit is RM100',
          })
          return
        }

        this.isSaving = true
        this.$axios
          .post('/api/user/profile/author/withdraws/', data)
          .then((r) => {
            this.$message.success('Submit success')
            this.$router.push(`/profile/author/withdraws/${r.data.id}`)
          })
          .catch((e) => {
            this.$responseError(e.response)
          })
          .finally(() => {
            this.isSaving = false
          })
      }
    },
  },
}
</script>
