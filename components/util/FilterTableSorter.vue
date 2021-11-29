<template>
  <th class="sortable" @click="$emit('click', field)">
    <div class="sort-info">
      <div class="sort-field">
        {{ title }}
      </div>
      <div class="sorter">
        <a-icon
          type="caret-up"
          :style="{
            color:
              field === sorter.field && ['asc', 'ascend'].includes(sorter.order)
                ? '#1890ff'
                : '#bfbfbf',
          }"
          style="margin-bottom: -4px"
        />
        <a-icon
          type="caret-down"
          :style="{
            color:
              field === sorter.field &&
              ['desc', 'descend'].includes(sorter.order)
                ? '#1890ff'
                : '#bfbfbf',
          }"
        />
      </div>
    </div>
  </th>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    field: {
      type: String,
      default: '',
    },
    sorter: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
<style lang="less" scoped>
th.sortable {
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
  .sort-info {
    display: flex;
    justify-content: center;
    .sort-field {
      display: flex;
      justify-content: center;
      flex-direction: column;
      flex: auto;
    }
    .sorter {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
