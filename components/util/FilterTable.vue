<template>
  <div class="filter-table">
    <a-pagination
      v-if="['both', 'top'].includes(paginationPosition)"
      v-model="pagination.current"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      size="small"
      @change="onPaginationChange"
    />
    <table>
      <thead>
        <tr>
          <template v-for="(c, i) in columns">
            <th
              v-if="!c.sorter"
              :key="i"
              :width="c.width"
              :class="c.headClass"
              class="text-center"
            >
              {{ c.title }}
            </th>
            <UtilFilterTableSorter
              v-else
              :key="i"
              class="text-center"
              :class="c.headClass"
              :width="c.width"
              :title="c.title"
              :field="c.dataIndex"
              :sorter="sorter"
              @click="sortData"
            />
          </template>
        </tr>
      </thead>
      <tbody v-if="isGotFilter" class="filter-table-filter">
        <tr>
          <td v-for="(c, i) in columns" :key="i">
            <template v-if="c.filter && c.isBoolean">
              <a-select v-model="filter[c.dataIndex]" class="select">
                <a-select-option value=""> &nbsp; </a-select-option>
                <a-select-option :value="1">
                  <a-icon type="check" style="color: green" />
                </a-select-option>
                <a-select-option :value="0">
                  <a-icon type="close" style="color: red" />
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="c.filter && Array.isArray(c.filter)">
              <a-select v-model="filter[c.dataIndex]" class="select">
                <a-select-option value=""> &nbsp; </a-select-option>
                <a-select-option
                  v-for="f in c.filter"
                  :key="f.value"
                  :value="f.value"
                >
                  {{ f.text }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="c.filter">
              <a-input v-model="filter[c.dataIndex]" allow-clear />
            </template>
          </td>
        </tr>
      </tbody>
      <tbody>
        <template v-if="data && data.length > 0">
          <tr
            v-for="(r, iRow) in data"
            :key="iRow"
            :class="{ selected: checkSelectedRow(r) }"
            @click="onSelectRow(r)"
          >
            <td v-for="(c, iCol) in columns" :key="iCol" :class="c.bodyClass">
              <template v-if="c.scopedSlot">
                <slot
                  :name="c.scopedSlot"
                  :rowData="r"
                  :cellData="r[c.dataIndex]"
                />
              </template>

              <template v-else-if="c.isIndex">
                {{ (current - 1) * pagination.pageSize + iRow + 1 }}
              </template>

              <template v-else-if="c.isBoolean">
                <UtilFilterTableDataBoolean :bool="r[c.dataIndex]" />
              </template>

              <template v-else-if="c.dataIndex && c.decimal !== undefined">
                {{ $formatNumber(r[c.dataIndex], { decimal: c.decimal }) }}
              </template>

              <template v-else-if="c.dataIndex">
                {{ r[c.dataIndex] }}
              </template>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colspan="columns.length" class="filter-table-empty">
              <a-empty />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <a-pagination
      v-if="['both', 'bottom'].includes(paginationPosition)"
      v-model="pagination.current"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      size="small"
      @change="onPaginationChange"
    />
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return []
      },
    },
    getUrl: {
      type: String,
      default: '',
    },
    getFilter: {
      type: Object,
      default: null,
    },
    initData: {
      type: Object,
      default() {
        return {}
      },
    },
    paginationPosition: {
      type: String,
      default: 'both',
    },
    isRowSelectable: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: String,
      default: null,
    },
  },
  data() {
    const filter = {}
    let isGotFilter = false
    this.columns.forEach((c) => {
      if (c.filter) {
        isGotFilter = true
        filter[c.dataIndex] = ''
        if (c.filterDefault !== undefined) {
          if (c.isBoolean) {
            filter[c.dataIndex] = c.filterDefault ? 1 : 0
          } else {
            filter[c.dataIndex] = c.filterDefault
          }
        }
      }
    })
    return {
      isGotFilter,
      filter,
      data: this.initData.results,
      sorter: {
        field: null,
        order: null,
      },
      pagination: {
        total: this.initData.count || 0,
        pageSize: 15,
        current: 1,
      },
      current: 1,
      selectedRowData: null,
    }
  },
  computed: {
    formattedFilter() {
      const ff = _.cloneDeep(this.filter)
      Object.keys(ff).forEach((key) =>
        ff[key] === '' || ff[key] === null ? delete ff[key] : ''
      )
      return { ...ff, ...this.getFilter }
    },
  },
  watch: {
    filter: {
      handler: _.debounce(function (v) {
        this.pagination.current = 1
        this.fetch({ page: 1 })
      }, 500),
      deep: true,
    },
    getFilter() {
      this.selectedRowData = null
      this.pagination.current = 1
      this.fetch({ page: 1 })
    },
  },
  methods: {
    sortData(f) {
      const { sorter } = this
      if (f === sorter.field) {
        if (sorter.order === 'asc') {
          sorter.order = 'desc'
        } else if (sorter.order === 'desc') {
          sorter.order = null
        } else {
          sorter.order = 'asc'
        }
      } else {
        sorter.field = f
        sorter.order = 'asc'
      }
      this.selectedRowData = null
      this.pagination.current = 1
      this.fetch({ page: 1 })
    },
    async fetch(params = {}) {
      const data = (
        await this.$axios.get(this.getUrl, {
          params: {
            filter: this.formattedFilter,
            sorter: this.sorter,
            ...params,
          },
        })
      ).data
      this.current = this.pagination.current
      this.data = data.results
      this.pagination.total = data.count
    },
    onPaginationChange(page, pageSize) {
      this.fetch({ page })
    },
    onSelectRow(rowData) {
      if (this.isRowSelectable) {
        this.selectedRowData = rowData
        this.$emit('select-row', rowData)
      }
    },
    checkSelectedRow(rowData) {
      const { rowKey, selectedRowData } = this
      if (rowKey && selectedRowData) {
        return rowData[rowKey] === selectedRowData[rowKey]
      }
      return rowData === selectedRowData
    },
    resetSelectedRow() {
      this.selectedRowData = null
    },
    updateRow(row) {
      const er = this.data.find((d) => d.id === row.id)
      if (er) {
        for (const key of Object.keys(er)) {
          er[key] = row[key]
        }
      }
    },
    unshiftRow(row) {
      this.data.unshift(row)
    },
  },
}
</script>
<style lang="less" scoped>
.filter-table {
  .ant-pagination {
    text-align: right;
    padding: 8px;
  }

  table {
    width: 100%;

    thead {
      th {
        font-weight: 600;
        border: 1px solid #e8e8e8;
        white-space: nowrap;
        padding: 4px 8px;
        background-color: #f6f6f6;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.85);
      }
    }

    tbody {
      tr {
        &.selected {
          background-color: #f0f0f0;
        }

        td {
          border: 1px solid #e8e8e8;
          font-size: 12px;
          padding: 4px 12px;
        }
      }
    }

    tbody:not(.filter-table-filter) tr:hover > td:not(.filter-table-empty) {
      background: lavender;
    }

    tbody:not(.filter-table-filter)
      tr.selected:hover
      > td:not(.filter-table-empty) {
      background: #bebef2;
    }

    tbody:not(.filter-table-filter) > tr:nth-child(odd) {
      background: #fafafa;
    }

    tbody.filter-table-filter {
      td {
        padding: 2px 2px;
        .ant-input,
        .ant-select {
          width: 100%;
          font-size: 12px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
