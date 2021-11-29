<template>
  <div>
    <a-icon
      v-if="bool === 1 || bool === true"
      type="check"
      style="color: green"
    />
    <a-icon v-else type="close" style="color: red" />
  </div>
</template>

<script>
export default {
  props: {
    bool: {
      type: [Boolean, Number],
      default: false,
      required: true,
    },
  },
}
</script>
