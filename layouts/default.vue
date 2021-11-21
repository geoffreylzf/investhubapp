<template>
  <a-layout>
    <a-layout-header theme="light">
      <NuxtLink to="/">
        <LogoSvg class="icon" />
        <span class="title">InvestHub</span>
      </NuxtLink>
    </a-layout-header>
    <a-layout-content>
      <Nuxt />
    </a-layout-content>
  </a-layout>
</template>
<script>
export default {
  components: {
    LogoSvg: () => import('~/assets/svg/logo.svg?inline'),
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
.icon {
  width: 20px;
  height: 20px;
  margin-right: 16px;
}
.title {
  font-size: 20px;
  color: whitesmoke;
  font-weight: 600;
}
</style>
