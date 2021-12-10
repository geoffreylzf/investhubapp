<template>
  <div class="container">
    <div class="main">
      <a-form :form="form" class="form-login" @submit.prevent="handleSubmit">
        <div class="form-login__label">
          <a href="#"> Enter username and password to login </a>
        </div>
        <a-form-item>
          <a-input
            v-decorator="[
              'email',
              {
                rules: [{ required: true, message: 'Please enter email' }],
              },
            ]"
            size="large"
            type="email"
            placeholder="Email"
          >
            <a-icon
              slot="prefix"
              :style="{ color: 'rgba(0,0,0,.25)' }"
              type="mail"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: 'Please enter password' }],
              },
            ]"
            size="large"
            type="password"
            autocomplete="false"
            placeholder="Password"
          >
            <a-icon
              slot="prefix"
              :style="{ color: 'rgba(0,0,0,.25)' }"
              type="lock"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="isLoading"
            :disabled="isLoading"
            size="large"
            type="primary"
            html-type="submit"
            class="form-login__button"
          >
            Login
          </a-button>
        </a-form-item>
      </a-form>
      <UtilSignInButton type="google" />
      <UtilSignInButton type="facebook" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      isLoading: false,
    }
  },
  head() {
    return {
      title: 'Login',
    }
  },
  methods: {
    handleSubmit(e) {
      this.form.validateFields((e, v) => {
        if (!e) {
          this.login(v)
        }
      })
    },
    login(v) {
      this.isLoading = true
      setTimeout(() => {
        this.$auth
          .loginWith('local', {
            data: v,
          })
          .then((r) => {
            this.$router.back()
            this.$notification.success({
              message: 'Welcome Back',
            })
          })
          .catch((e) => {
            let message = e.toString()
            if (e.response) {
              if (e.response.data) {
                message = e.response.data.detail
              } else {
                message = e.response.data
              }
            }
            this.$message.error(message)
          })
          .finally(() => {
            this.isLoading = false
          })
      }, 500)
    },
  },
}
</script>
<style lang="less" scoped>
.main {
  min-width: 260px;
  width: 368px;
  margin: 48px auto;

  .form-login {
    .form-login__label {
      text-align: center;
      font-size: 14px;
      padding: 24px;
    }
    .form-login__button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }
  }
}
</style>
