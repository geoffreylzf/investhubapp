<template>
  <button class="btn" @click="$emit('click')">
    <PaypalSvg />
  </button>
</template>

<script>
export default {
  components: {
    PaypalSvg: () => import('~/assets/svg/paypal.svg?inline'),
  },
}
</script>

<style lang="less" scoped>
.btn {
  border: 1px solid lightgray;
  border-radius: 2px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  padding: 0 12px;
  height: 44px;
  cursor: pointer;
}
</style>
