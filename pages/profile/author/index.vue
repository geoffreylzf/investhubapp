<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"></a-col>
    <a-col :xs="24" :sm="8" class="content-left">
      <h1>Your Author Profile</h1>
      <a-form :form="form">
        <a-form-item
          :label="'Commission Percentage (%) : ' + author.commission_pct + '%'"
          :colon="false"
        />
        <a-form-item label="Bio">
          <a-textarea
            v-decorator="[
              'bio',
              {
                rules: [{ required: true, message: 'Please enter bio' }],
              },
            ]"
            auto-size
            :max-length="500"
          />
        </a-form-item>
        <a-form-item label="Bank">
          <a-select v-decorator="['acc_bank']">
            <a-select-option
              v-for="(b, i) in accBankList"
              :key="i"
              :value="b.id"
              allow-clear
            >
              {{ b.acc_bank_code }} ~ {{ b.acc_bank_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Bank Account Name">
          <a-input v-decorator="['bank_account_name']" :max-length="100" />
        </a-form-item>
        <a-form-item label="Bank Account No">
          <a-input v-decorator="['bank_account_no']" :max-length="50" />
        </a-form-item>
        <a-form-item label="Mobile No">
          <a-input v-decorator="['mobile_no']" :max-length="50" />
        </a-form-item>
      </a-form>
      <a-button
        block
        type="primary"
        icon="save"
        :disabled="!isDirty"
        @click="saveAuthor()"
      >
        Save
      </a-button>
    </a-col>
    <a-col :xs="24" :sm="8" class="content-right">
      <h2>Your Latest Article</h2>
      <nuxt-link to="/profile/author/articles">
        <a-button icon="container">View All Your Articles</a-button>
      </nuxt-link>
      <br />
      <br />
      <h2>Your Total Donation</h2>
    </a-col>
    <a-col :xs="0" :sm="4"></a-col>
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const author = (await $axios.get(`/api/user/profile/author/`)).data

    const accBankList = (
      await $axios.get('/api/acc/banks/', {
        params: { select: {} },
      })
    ).data
    return {
      author,
      accBankList,
    }
  },
  data() {
    return {
      isDirty: false,
      form: (() => {
        const form = this.$form.createForm(this, {
          onValuesChange: (p, v) => {
            this.isDirty = true
          },
        })
        return form
      })(),
    }
  },
  head() {
    return {
      title: 'Your Author Profile',
    }
  },
  mounted() {
    this.form.setFieldsValue({
      bio: this.author.bio,
      acc_bank: this.author.acc_bank,
      bank_account_name: this.author.bank_account_name,
      bank_account_no: this.author.bank_account_no,
      mobile_no: this.author.mobile_no,
    })
    this.isDirty = false
  },
  methods: {
    saveAuthor() {
      let at = null
      this.form.validateFields((e, v) => {
        if (!e) {
          at = v
        }
      })

      if (at) {
        this.$axios
          .put(`/api/user/profile/author/`, at)
          .then((r) => {
            this.$message.success('Save success')
            this.isDirty = false
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
.content-left {
  padding-right: 16px;
}
</style>
