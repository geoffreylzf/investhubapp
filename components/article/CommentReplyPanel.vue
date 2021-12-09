<template>
  <div v-if="data.length !== 0">
    <table class="reply-tb mt-4">
      <tbody>
        <tr v-for="reply in data" :key="reply.id">
          <td>
            <a-avatar :size="24" :src="reply.user_img_path" />
          </td>
          <td>
            <div class="reply-ctn">
              <div class="header">
                <div class="header-left">
                  <span class="user-firstname">
                    {{ reply.user_first_name }}
                    <a-tooltip v-if="articleAuthorUserId === reply.user">
                      <template #title>This article's author </template>
                      <a-icon class="author-icon" type="user" />
                    </a-tooltip>
                  </span>
                  <span class="create-date">
                    <a-tooltip>
                      <template #title>{{ reply.created_at }}</template>
                      {{ formatHumanDate(reply.created_at) }}
                    </a-tooltip>
                  </span>
                </div>
                <div class="header-right">
                  <a-tooltip
                    v-if="isLoggedInUserOwnReply(reply.user) && !reply.isEdit"
                  >
                    <template #title>Edit reply</template>
                    <a-icon
                      type="edit"
                      class="edit-icon"
                      @click="editReply(reply)"
                    />
                  </a-tooltip>
                </div>
              </div>
              <div class="content">
                <div v-if="reply.isEdit">
                  <a-textarea
                    v-model="reply.tempContent"
                    class="mt-4 mb-4"
                    auto-size
                  />
                  <div class="text-right">
                    <a-button @click="cancelEditReply(reply)">
                      Cancel
                    </a-button>
                    <a-button icon="edit" @click="saveEditedReply(reply)">
                      Edit
                    </a-button>
                  </div>
                </div>
                <div v-else>{{ reply.content }}</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <a-pagination
      v-model="pagination.current"
      class="text-right mt-12 mb-12"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      size="small"
      @change="onPaginationChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  props: {
    articleId: {
      type: Number,
      required: true,
    },
    commentId: {
      type: Number,
      required: true,
    },
    articleAuthorUserId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      getUrl: `/api/articles/${this.articleId}/comments/${this.commentId}/replies/`,
      data: [],
      pagination: {
        total: 0,
        pageSize: 5,
        current: 1,
      },
      current: 1,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  async mounted() {
    await this.refresh()
  },
  methods: {
    async fetch(params = {}) {
      const data = (
        await this.$axios.get(this.getUrl, {
          params: {
            sorter: this.sorter,
            size: 5,
            ...params,
          },
        })
      ).data
      const res = data.results
      res.forEach((r) => {
        r.isEdit = false
        r.tempContent = null
      })
      this.current = this.pagination.current
      this.data = res
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
    isLoggedInUserOwnReply(replyUserId) {
      if (!this.isAuthenticated) {
        return false
      }
      if (this.loggedInUser.id === replyUserId) {
        return true
      }
      return false
    },
    editReply(reply) {
      reply.tempContent = reply.content
      reply.isEdit = true
    },
    cancelEditReply(reply) {
      reply.tempContent = null
      reply.isEdit = false
    },
    async saveEditedReply(reply) {
      const data = {
        content: reply.tempContent,
      }
      try {
        const res = await this.$axios.put(
          `/api/articles/${this.articleId}/comments/${this.commentId}/replies/${reply.id}/`,
          data
        )

        const resData = res.data
        reply.content = resData.content
        reply.updated_at = resData.updated_at

        reply.tempContent = null
        reply.isEdit = false
      } catch (e) {
        this.$responseError(e.response)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.reply-tb {
  tbody {
    tr {
      td:first-child {
        vertical-align: top;

        .ant-avatar {
          margin: 4px;
        }
      }

      td:nth-child(2) {
        width: 100%;

        .reply-ctn {
          background: #fafafa;
          padding: 4px 8px;
          margin-bottom: 4px;
          .header {
            display: flex;
            justify-content: space-between;

            .user-firstname {
              margin-right: 4px;
              font-weight: bold;
              font-size: 13px;

              .author-icon {
                color: #5c6bc0;
              }
            }

            .create-date {
              color: lightgray;
              font-size: 11px;
            }

            .edit-icon {
              padding: 0 8px;
              cursor: pointer;
              color: lightgray;
            }
          }

          .content {
            display: block;
          }
        }
      }
    }
  }
}
</style>
