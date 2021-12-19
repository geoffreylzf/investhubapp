<template>
  <a-layout>
    <a-layout-header theme="light">
      <a-row>
        <a-col :span="12">
          <NuxtLink to="/">
            <LogoSvg class="logo" />
            <span class="title">InvestHub</span>
          </NuxtLink>
        </a-col>
        <a-col :span="12" class="header-right">
          <a-dropdown v-if="isAuthenticated">
            <a-icon type="user" class="icon" />
            <a-menu slot="overlay" style="width: 100px">
              <a-menu-item @click="toProfile()"> Profile </a-menu-item>
              <a-menu-item @click="onLogout()"> Logout </a-menu-item>
            </a-menu>
          </a-dropdown>

          <a-icon
            v-if="!isAuthenticated"
            type="login"
            class="icon"
            @click="toLoginPage()"
          />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <Nuxt />
    </a-layout-content>
    <a-layout-footer>
      <div class="mb-4">
        Copyright
        <a-icon type="copyright" /> {{ new Date().getFullYear() }}
        <span>investhub.org. All Rights Reserved</span>
      </div>
      <nuxt-link to="/contact-us">Contact Us</nuxt-link>
    </a-layout-footer>
  </a-layout>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    LogoSvg: () => import('~/assets/svg/logo.svg?inline'),
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  methods: {
    toLoginPage() {
      this.$router.push('/login')
    },
    toProfile() {
      this.$router.push('/profile')
    },
    onLogout() {
      this.$confirm({
        title: 'Logout?',
        content: 'Confirm to logout?',
        okText: 'Logout',
        onOk: () => {
          this.$auth.logout()
          this.$nuxt.refresh()
        },
        onCancel() {},
      })
    },
  },
}
</script>
<style lang="less" scoped>
.ant-layout-header {
  height: 48px;
  line-height: 48px;
  padding: 0 24px;
  background-image: linear-gradient(to right, #5c6bc0, #ab47bc);
}
.ant-layout-content {
  background: white;
  min-height: calc(100vh - 48px - 56px);
}
.header-right {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.logo {
  width: 20px;
  height: 20px;
  margin-right: 16px;
}
.title {
  font-size: 20px;
  color: whitesmoke;
  font-weight: 600;
}
.icon {
  margin-left: 24px;
  font-size: 24px;
  color: white;
  cursor: pointer;
}
.ant-layout-footer {
  padding: 8px;
  text-align: center;
  font-size: 12px;
}
</style>
