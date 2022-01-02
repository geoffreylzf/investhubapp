<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4" class="ads">
      <!-- Left Ads -->
      <GoogleAds ad-slot="4116204407" />
    </a-col>
    <a-col :xs="24" :sm="0" class="ads-small">
      <!-- Top Ads -->
      <GoogleAds ad-slot="8954254654" />
    </a-col>
    <a-col :xs="24" :sm="16" class="content">
      <slot />
    </a-col>
    <a-col :xs="24" :sm="0" class="ads-small">
      <!-- Bottom Ads -->
      <GoogleAds ad-slot="8762682963" />
    </a-col>
    <a-col :xs="0" :sm="4" class="ads">
      <!-- Right Ads -->
      <GoogleAds ad-slot="6574846780" />
    </a-col>
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
