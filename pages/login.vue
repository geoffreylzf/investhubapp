<template>
  <client-only>
    <div class="main">
      <a-spin :spinning="isNotMount || isLoading">
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
        <UtilSignInButton type="google" @click="loginGoogle()" />
        <UtilSignInButton type="facebook" @click="loginFacebook()" />
      </a-spin>
    </div>
  </client-only>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      isLoading: false,
      isNotMount: true,
    }
  },
  head() {
    return {
      title: 'Login',
    }
  },
  mounted() {
    this.isNotMount = false
    const code = this.$route.query.code
    const strategy = this.$auth.$state.strategy

    if (code && strategy) {
      this.login({
        provider: strategy,
        code,
      })
    }
  },
  methods: {
    savePreRouteInVuex() {
      const preRoute = this.$nuxt.context.from
      if (preRoute) {
        localStorage.setItem('login_redirect_uri', preRoute.fullPath)
      }
    },
    handleSubmit(e) {
      this.savePreRouteInVuex()
      this.form.validateFields((e, v) => {
        if (!e) {
          this.login(v)
        }
      })
    },
    loginFacebook() {
      this.savePreRouteInVuex()
      this.$auth.loginWith('facebook')
    },
    loginGoogle() {
      this.savePreRouteInVuex()
      this.$auth.loginWith('google')
    },
    login(v) {
      this.isLoading = true
      setTimeout(() => {
        this.$auth
          .loginWith('local', {
            data: v,
          })
          .then((r) => {
            const loginRedirectUri = localStorage.getItem('login_redirect_uri')
            if (loginRedirectUri) {
              this.$router.push(loginRedirectUri)
              localStorage.removeItem('login_redirect_uri')
            } else {
              this.$router.push('/')
            }
          })
          .catch((e) => {
            this.$responseError(e.response)
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
  .redirect {
    margin-top: 8px;
    font-size: 12px;
  }
}
</style>
