<template>
  <a-row class="container">
    <a-col :sm="0" :lg="8" />
    <a-col :sm="24" :lg="8" class="content">
      <h1>Author Registration</h1>
      <a-form :form="form">
        <a-form-item label="Bio">
          <a-textarea
            v-decorator="[
              'bio',
              {
                rules: [{ required: true, message: 'Please enter bio' }],
              },
            ]"
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
      <p>Note: Bank info and mobile no are not required</p>
      <a-button block type="primary" icon="form" @click="registerAuthor()">
        Register
      </a-button>
    </a-col>
    <a-col :sm="0" :lg="8" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios, redirect }) {
    const profile = (await $axios.get(`/api/user/profile/`)).data.profile
    if (profile.is_author) {
      redirect('/profile')
    }

    const accBankList = (
      await $axios.get('/api/acc/banks/', {
        params: { select: {} },
      })
    ).data
    return {
      profile,
      accBankList,
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
    }
  },
  head() {
    return {
      title: 'Author Registration',
    }
  },
  methods: {
    registerAuthor() {
      let data = null
      this.form.validateFields((e, v) => {
        if (!e) {
          data = v
        }
      })

      if (data) {
        this.$axios
          .post(`/api/user/profile/author-registration/`, data)
          .then((r) => {
            this.$message.success('Register success')
            this.$router.push('/profile/author')
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
<style lang="less" scoped>
.container {
  padding: 16px;
}
</style>
