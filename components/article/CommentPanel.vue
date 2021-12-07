<template>
  <div class="mt-24">
    <a-pagination
      v-model="pagination.current"
      class="text-right mb-12"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      size="small"
      @change="onPaginationChange"
    />

    <table>
      <tbody>
        <tr v-for="comment in data" :key="comment.id">
          <td><a-avatar :size="48" :src="comment.user_img_path" /></td>
          <td>
            <div class="comment-user">
              <span div class="comment-user-firstname">
                {{ comment.user_first_name }}
                <a-tag
                  v-if="userId === comment.user"
                  color="orange"
                  class="ml-4 mr-0"
                >
                  Author
                </a-tag>
              </span>
              <span class="comment-create-date">
                {{ formatHumanDate(comment.created_at) }}
              </span>
            </div>
            <pre class="comment-text">
              {{ comment.content }}
            </pre>
          </td>
        </tr>
      </tbody>
    </table>

    <a-pagination
      v-model="pagination.current"
      class="text-right mt-12"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      size="small"
      @change="onPaginationChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    articleId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      getUrl: `/api/articles/${this.articleId}/comments/`,
      data: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
      current: 1,
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async fetch(params = {}) {
      const data = (
        await this.$axios.get(this.getUrl, {
          params: {
            sorter: this.sorter,
            size: 10,
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
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    formatHumanDate(datetime) {
      if (datetime) {
        return this.capitalizeFirstLetter(moment(datetime).fromNow())
      }
    },
    async refresh() {
      await this.fetch({ page: 1 })
    },
  },
}
</script>

<style lang="less" scoped>
table {
  border-collapse: collapse;

  td {
    border: 1px solid #e8e8e8;
  }

  td:first-child {
    vertical-align: top;

    .ant-avatar {
      margin: 8px;
    }
  }

  td:nth-child(2) {
    width: 100%;
    .comment-user {
      margin: 8px 4px 0 4px;

      .comment-user-firstname {
        margin: 0 4px;
        font-weight: bold;
      }

      .comment-create-date {
        color: lightgray;
        font-size: 11px;
      }
    }

    .comment-text {
      margin: 0 8px 8px 8px;
      font-family: 'Roboto', 'Open Sans', sans-serif;
      white-space: pre-line;
    }
  }
}
</style>
