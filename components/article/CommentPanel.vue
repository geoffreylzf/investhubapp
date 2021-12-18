<template>
  <div>
    <a-skeleton active :loading="isMounting" />
    <div v-if="!isMounting" class="mt-24">
      <a-divider v-if="data.length === 0">
        No comment yet, be the first to write comment
      </a-divider>
      <div v-else>
        <a-pagination
          v-model="pagination.current"
          class="text-right mb-12"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :show-total="(total) => `Total ${total} comments`"
          @change="onPaginationChange"
        />
        <table>
          <tbody>
            <tr v-for="comment in data" :key="comment.id">
              <td><a-avatar :size="48" :src="comment.user_img_path" /></td>
              <td>
                <div class="comment-ctn">
                  <div class="header">
                    <div class="header-left">
                      <span class="user-firstname">
                        {{ comment.user_first_name }}
                        <a-tooltip v-if="articleAuthorUserId === comment.user">
                          <template #title>This article's author </template>
                          <a-icon class="author-icon" type="user" />
                        </a-tooltip>
                      </span>
                      <span class="create-date">
                        <a-tooltip>
                          <template #title>{{ comment.created_at }}</template>
                          {{ $formatHumanDate(comment.created_at) }}
                        </a-tooltip>
                      </span>
                    </div>
                    <div class="header-right">
                      <a-tooltip
                        v-if="
                          isLoggedInUserOwnComment(comment.user) &&
                          !comment.isEdit
                        "
                      >
                        <template #title>Edit comment</template>
                        <a-icon
                          type="edit"
                          class="edit-icon"
                          @click="editComment(comment)"
                        />
                      </a-tooltip>
                    </div>
                  </div>
                  <div class="content">
                    <div v-if="comment.isEdit">
                      <a-textarea
                        v-model="comment.tempContent"
                        class="mt-4 mb-4"
                        auto-size
                      />
                      <div class="text-right">
                        <a-button @click="cancelEditComment(comment)">
                          Cancel
                        </a-button>
                        <a-button
                          icon="edit"
                          @click="saveEditedComment(comment)"
                        >
                          Edit
                        </a-button>
                      </div>
                    </div>
                    <pre v-else>{{ comment.content }}</pre>
                  </div>
                  <div class="footer">
                    <span
                      v-if="isAuthenticated"
                      class="reply-btn"
                      @click="replyBtnClick(comment)"
                    >
                      Reply
                    </span>
                    <div v-if="comment.isShowReplyInput">
                      <a-input
                        :ref="'comment_' + comment.id + '_replyInput'"
                        v-model="comment.replyContent"
                        class="mt-4 mb-4"
                        placeholder="Enter reply"
                      />
                      <div class="text-right">
                        <a-button @click="cancelReply(comment)">
                          Cancel
                        </a-button>
                        <a-button icon="rollback" @click="postReply(comment)">
                          Reply
                        </a-button>
                      </div>
                    </div>
                    <ArticleCommentReplyPanel
                      :ref="'comment_' + comment.id + '_replyPanel'"
                      v-bind="$props"
                      :comment-id="comment.id"
                    />
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
          :show-total="(total) => `Total ${total} comments`"
          @change="onPaginationChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    articleId: {
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
      getUrl: `/api/articles/${this.articleId}/comments/`,
      data: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
      current: 1,

      isMounting: true,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  async mounted() {
    await this.refresh()
    this.isMounting = false
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
      const res = data.results
      res.forEach((r) => {
        r.isEdit = false
        r.tempContent = null

        r.isShowReplyInput = false
        r.replyContent = null
      })
      this.current = this.pagination.current
      this.data = res
      this.pagination.total = data.count
    },
    onPaginationChange(page, pageSize) {
      this.fetch({ page })
    },
    async refresh() {
      await this.fetch({ page: 1 })
    },
    isLoggedInUserOwnComment(commentUserId) {
      if (!this.isAuthenticated) {
        return false
      }
      if (this.loggedInUser.id === commentUserId) {
        return true
      }
      return false
    },
    editComment(comment) {
      comment.tempContent = comment.content
      comment.isEdit = true
    },
    cancelEditComment(comment) {
      comment.tempContent = null
      comment.isEdit = false
    },
    async saveEditedComment(comment) {
      const data = {
        content: comment.tempContent,
      }
      try {
        const res = await this.$axios.put(
          `/api/articles/${this.articleId}/comments/${comment.id}/`,
          data
        )

        const resData = res.data
        comment.content = resData.content
        comment.updated_at = resData.updated_at

        comment.tempContent = null
        comment.isEdit = false
      } catch (e) {
        this.$responseError(e.response)
      }
    },
    replyBtnClick(comment) {
      comment.replyContent = ''
      comment.isShowReplyInput = true
      this.$nextTick(() => {
        this.$refs[`comment_${comment.id}_replyInput`][0].focus()
      })
    },
    cancelReply(comment) {
      comment.replyContent = null
      comment.isShowReplyInput = false
    },
    async postReply(comment) {
      const reply = comment.replyContent
      const artId = this.articleId
      const commentId = comment.id

      if (reply) {
        try {
          await this.$axios.post(
            `/api/articles/${artId}/comments/${commentId}/replies/`,
            {
              content: reply,
            }
          )

          comment.replyContent = null
          comment.isShowReplyInput = false
          this.$refs[`comment_${comment.id}_replyPanel`][0].refresh()
        } catch (e) {
          this.$responseError(e.response)
        }
      }
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
    .comment-ctn {
      padding: 4px 8px;
      .header {
        display: flex;
        justify-content: space-between;

        .user-firstname {
          margin-right: 4px;
          font-weight: bold;

          .author-icon {
            color: #5c6bc0;
          }
        }

        .create-date {
          color: lightgray;
          font-size: 11px;
        }

        .edit-icon {
          margin-right: 4px;
          cursor: pointer;
          color: lightgray;
        }
      }

      .content {
        margin-bottom: 8px;
        pre {
          font-family: 'Roboto', 'Open Sans', sans-serif;
          white-space: pre-line;
        }
      }

      .footer {
        .reply-btn {
          color: skyblue;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
