<template>
  <div>
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
          #
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

      <a-textarea
        v-if="para.type === 'text'"
        v-model="para.content"
        auto-size
      />

      <UserAuthorArticleFormImgUploader
        v-else-if="para.type === 'image'"
        :article-img="para.article_img"
        :article-img-path="para.article_img_path"
        @uploadArticleImg="para.article_img = $event"
        @uploadArticleImgPath="para.article_img_path = $event"
      />
    </div>
    <a-divider />
    <a-button-group>
      <a-button icon="file-text" @click="addParagraph()">
        Add Paragraph
      </a-button>
      <a-button icon="file-image" @click="addImage()"> Add Picture </a-button>
    </a-button-group>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    mode: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    let article = {
      article_title: '',
      is_publish: false,
      paragraphs: [
        {
          order: 1,
          is_supporter_view_only: false,

          type: 'text',
          content: '',
          article_img: null,
          article_img_path: null,
        },
      ],
    }

    if (this.mode === 'update' && this.data) {
      article = _.cloneDeep(this.data)
    }

    return {
      article,
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

        type: 'text',
        content: '',
        article_img: null,
        article_img_path: null,
      })
    },
    addImage() {
      this.article.paragraphs.push({
        order: this.getParagraphNewOrder(),
        is_supporter_view_only: false,

        type: 'image',
        content: '',
        article_img: null,
        article_img_path: null,
      })
    },
    validate() {
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

      return this.article
    },
  },
}
</script>

<style lang="less" scoped>
.input-title {
  margin-bottom: 8px;
}

.para-container {
  background: whitesmoke;
  padding: 16px;
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
</style>
