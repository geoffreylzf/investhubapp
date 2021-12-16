<template>
  <a-row class="m-16">
    <a-col :sm="0" :md="4" />
    <a-col :sm="24" :md="16">
      <h1>
        Withdraw Detail
        <a-tag color="orange">
          {{ data.flow_status_desc }}
        </a-tag>
      </h1>
      <a-spin :spinning="isUpdatingStatus">
        <a-button-group>
          <nuxt-link to="/profile/author/withdraws">
            <a-button icon="bars">Withdraw History</a-button>
          </nuxt-link>
          <a-button
            v-if="data.flow_status === 100"
            icon="delete"
            @click="deleteConfirmation()"
          >
            Delete
          </a-button>
          <a-button
            v-if="data.flow_status === 100"
            @click="onUpdateFlowStatus('confirm')"
          >
            <a-icon type="step-forward" style="color: green" />
            Confirm
          </a-button>
          <a-button
            v-if="data.flow_status === 200"
            @click="onUpdateFlowStatus('unconfirm')"
          >
            <a-icon type="step-backward" style="color: red" />
            Unconfirm
          </a-button>
        </a-button-group>
        <a-statistic
          title="Withdraw Date"
          :value="data.withdraw_date"
          class="mt-16"
        />
        <a-statistic
          title="Withdraw Amount (RM)"
          :value="data.amt"
          :precision="2"
          class="mt-16"
        />
        <a-statistic
          title="Your Remark"
          :value="data.author_remark"
          class="mt-16"
        />
        <a-statistic
          title="System Remark"
          :value="data.system_remark || '~'"
          class="mt-16"
        />
        <a-statistic
          title="Reference No"
          :value="data.reference_no || '~'"
          class="mt-16"
        />
      </a-spin>
    </a-col>
    <a-col :sm="0" :md="4" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    const id = parseInt(params.id)
    const data = (await $axios.get(`/api/user/profile/author/withdraws/${id}`))
      .data

    return {
      id,
      data,
    }
  },
  data() {
    return {
      isUpdatingStatus: false,
    }
  },
  methods: {
    deleteConfirmation() {
      this.$confirm({
        title:
          'Delete this withdraw? You can submit another withdraw after delete',
        onOk: () => {
          this.drop()
        },
      })
    },
    drop() {
      this.$axios
        .delete(`/api/user/profile/author/withdraws/${this.id}/`)
        .then((r) => {
          this.$message.success('Delete success')
          this.$router.push('/profile/author/withdraws')
        })
        .catch((e) => {
          this.$responseError(e.response)
        })
    },
    onUpdateFlowStatus(action) {
      const { $confirm } = this
      switch (action) {
        case 'confirm': {
          $confirm({
            title: 'Confirm withdraw?',
            content:
              'Your withdraw request will be processed accordingly in 2-3 days',
            onOk: () => {
              this.updateFlowStatus(action)
            },
          })
          break
        }
        case 'unconfirm': {
          $confirm({
            title: 'Unconfirm withdraw?',
            content: 'Your withdraw request will not be processed',
            onOk: () => {
              this.updateFlowStatus(action)
            },
          })
          break
        }
      }
    },
    async updateFlowStatus(action) {
      const { $axios, id } = this
      try {
        this.isUpdatingStatus = true
        await new Promise((resolve) => setTimeout(resolve, 200))
        await $axios.post(`/api/user/profile/author/withdraws/${id}/${action}/`)
        await this.$nuxt.refresh()
      } catch (e) {
        this.$responseError(e.response)
      } finally {
        this.isUpdatingStatus = false
      }
    },
  },
}
</script>
