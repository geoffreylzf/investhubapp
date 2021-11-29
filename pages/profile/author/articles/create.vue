<template>
  <a-row class="container">
    <a-col :xs="0" :sm="4"></a-col>
    <a-col :xs="24" :sm="16">
      <h1>Create New Article</h1>
      <a-input
        v-model="article.article_title"
        class="input-title"
        placeholder="Title"
        :max-length="300"
      />
      <a-checkbox
        :checked="article.is_publish === true"
        @input="(v) => (article.is_publish = v)"
      >
        Publish (Everyone can read it)
      </a-checkbox>
      <a-divider>Paragraphs</a-divider>
      <div
        v-for="(para, i) in article.paragraphs"
        :key="i"
        class="para-container"
      >
        <div class="para-option-container">
          <div>
            No :
            <a-input-number v-model="para.order" />
            &nbsp;
            <a-checkbox
              :checked="para.is_supporter_view_only === true"
              @input="(v) => (para.is_supporter_view_only = v)"
            >
              Only your supporter can view
            </a-checkbox>
          </div>
          <a-space />
          <a-icon
            type="close"
            class="para-option-container-close"
            style="font-size: 16px"
            @click="deleteParagraph(para, i)"
          />
        </div>

        <a-textarea v-model="para.content" auto-size />
      </div>
      <a-divider />
      <a-button-group>
        <a-button icon="file-text" @click="addParagraph()">
          Add Paragraph
        </a-button>
        <a-button icon="file-image"> Add Picture </a-button>
      </a-button-group>
      <br />
      <br />
      <a-button block type="primary" icon="save" @click="createArticle()">
        Save
      </a-button>
    </a-col>
    <a-col :xs="0" :sm="4"></a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      article: {
        article_title: '',
        is_publish: false,
        paragraphs: [
          {
            order: 1,
            is_supporter_view_only: false,

            is_img: false,
            content: '',
            article_img_path: null,
          },
        ],
      },
    }
  },
  head() {
    return {
      title: 'Create New Article',
    }
  },
  methods: {
    deleteParagraph(para, i) {
      this.$confirm({
        title: `Confirm to delete paragraph ${para.order} ?`,
        okText: 'Delete',
        onOk: () => {
          this.article.paragraphs.splice(i, 1)
        },
      })
    },
    getParagraphNewOrder() {
      const maxNo =
        this.article.paragraphs.length > 0
          ? Math.max(...this.article.paragraphs.map((x) => x.order))
          : 0
      return maxNo + 1
    },
    addParagraph() {
      this.article.paragraphs.push({
        order: this.getParagraphNewOrder(),
        is_supporter_view_only: false,

        is_img: false,
        content: '',
        article_img_path: null,
      })
    },
    addImage() {},
    createArticle() {
      if (!this.article.article_title) {
        this.$error({
          title: 'Please enter title',
        })
        return
      }

      if (this.article.paragraphs.length === 0) {
        this.$error({
          title: 'Please enter at least 1 paragraph',
        })
        return
      }

      this.$axios
        .post('/api/user/profile/author/articles//', this.article)
        .then((r) => {
          this.$message.success('Create success')
          this.$router.push(`/profile/author/articles/${r.data.id}`)
        })
        .catch((e) => {
          this.$responseError(e.response)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  padding: 16px;

  .input-title {
    margin-bottom: 8px;
  }

  .para-container {
    background: whitesmoke;
    padding: 8px 16px;
    margin-bottom: 8px;

    .para-option-container {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .para-option-container-close {
        margin-left: auto;
      }
    }
  }
}
</style>
