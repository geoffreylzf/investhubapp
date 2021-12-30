<template>
  <button class="btn" @click="signIn()">
    <GoogleSvg v-if="type === 'google'" style="width: 24px" class="icon" />
    <FacebookSvg v-if="type === 'facebook'" style="width: 24px" class="icon" />
    Login / Signup with {{ type.toUpperCase() }}
  </button>
</template>

<script>
export default {
  components: {
    GoogleSvg: () => import('~/assets/svg/google.svg?inline'),
    FacebookSvg: () => import('~/assets/svg/facebook.svg?inline'),
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  methods: {
    signIn() {
      this.$emit('click')
    },
  },
}
</script>
<style lang="less" scoped>
.btn {
  border: 1px solid grey;
  border-radius: 2px;
  background: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  margin-bottom: 4px;

  .icon {
    margin: 0 12px;
  }
}
</style>
