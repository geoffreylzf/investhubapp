<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" class="ads"> Advertisement</a-col>
    <a-col :xs="24" :sm="0" class="ads-small">Advertisement</a-col>
    <a-col :xs="24" :sm="16" class="content">
      <slot />
    </a-col>
    <a-col :xs="24" :sm="0" class="ads-small">Advertisement</a-col>
    <a-col :xs="0" :sm="4" class="ads"> Advertisement </a-col>
  </a-row>
</template>

<script>
export default {}
</script>
<style lang="less" scoped>
.container {
  .ads {
    padding: 16px;
  }
  .ads-small {
    padding: 8px;
  }
}
</style>
