<template>
  <button
    class="px-4 py-2 inline-flex items-center border border-transparent font-medium rounded-sm text-white"
    :class="[bgColor, hoverBgColor]"
  >
    <span v-if="$slots.icon" class="w-4 h4 mr-2 fill-current text-white">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: 'bg-indigo-900',
    },
    hoverBgColor: {
      type: String,
      default: 'hover:bg-indigo-600',
    },
  },
}
</script>
