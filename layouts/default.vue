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
          <a-icon v-if="isAuthenticated" type="user" class="icon" />
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
}
</style>
