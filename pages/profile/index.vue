<template>
  <a-row class="container">
    <a-col :xs="0" :lg="4" />
    <a-col :xs="24" :md="12" :lg="8">
      <h1>Your Profile</h1>
      <a-form :form="form">
        <a-form-item :label="`Email : ${profile.email}`" :colon="false" />
        <UserProfileImgUploader
          :user-img="profile.user_img"
          :user-img-path="profile.user_img_path"
          @uploadUserImg="handleUploadedImg"
        />
        <a-form-item label="First Name">
          <a-input
            v-decorator="[
              'first_name',
              {
                rules: [{ required: true, message: 'Please enter first name' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="Last Name">
          <a-input
            v-decorator="[
              'last_name',
              {
                rules: [{ required: true, message: 'Please enter last name' }],
              },
            ]"
          />
        </a-form-item>
      </a-form>
      <a-button
        block
        type="primary"
        icon="save"
        :disabled="!isDirty"
        @click="saveProfile()"
      >
        Save
      </a-button>

      <a-divider />
      <nuxt-link v-if="profile.is_author" to="/profile/author">
        <a-button block icon="dashboard" size="large">
          Author Dashboard
        </a-button>
      </nuxt-link>
      <nuxt-link v-else to="/profile/author-registration">
        <a-button block icon="form" size="large">
          Author Registration
        </a-button>
      </nuxt-link>
      <a-divider />
    </a-col>
    <a-col :xs="24" :md="12" :lg="8">
      <a-statistic
        title="Your Following"
        :value="data.following_count"
        suffix="Authors"
      />
      <br />
      <nuxt-link to="/profile/followings">
        <a-button>Manage Your Followings</a-button>
      </nuxt-link>
    </a-col>
    <a-col :xs="0" :lg="4" />
  </a-row>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const profile = (await $axios.get(`/api/user/profile/`)).data.profile
    const data = (await $axios.get(`/api/user/profile/data/`)).data
    return {
      profile,
      data,
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
      title: 'Your Profile',
    }
  },
  mounted() {
    this.form.setFieldsValue({
      first_name: this.profile.first_name,
      last_name: this.profile.last_name,
    })
    this.isDirty = false
  },
  methods: {
    handleUploadedImg(imgData) {
      this.profile.user_img = imgData.id
      this.profile.user_img_path = imgData.path
      this.isDirty = true
    },
    saveProfile() {
      let pf = null
      this.form.validateFields((e, v) => {
        if (!e) {
          pf = v
        }
      })

      if (pf) {
        pf.user_img = this.profile.user_img
        this.$axios
          .put(`/api/user/profile/`, pf)
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
</style>
