<template>
  <div>
    <a-upload
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="handleUpload"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>

<script>
export default {
  props: {
    articleImg: {
      type: Number,
      default: null,
    },
    articleImgPath: {
      type: String,
      default: null,
    },
  },
  data() {
    const fileList = []

    if (this.articleImgPath) {
      fileList.push({
        uid: -1,
        name: 'default',
        status: 'done',
        url: this.articleImgPath,
      })
    }

    return {
      fileList,
    }
  },
  methods: {
    handleChange({ fileList }) {
      if (fileList.length === 0) {
        this.fileList = []
        this.$emit('uploadArticleImg', null)
        this.$emit('uploadArticleImgPath', null)
      }
    },
    async handleUpload(file) {
      if (this.fileList.length >= 1) {
        this.$message.error('Please upload 1 picture only')
        return false
      }
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.$message.error('Please upload JPG file only')
        return false
      }
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('Please upload size smaller than 5MB only')
        return false
      }

      const formData = new FormData()
      formData.append('path', file)
      try {
        const res = await this.$axios.post(
          '/api/user/profile/author/article-imgs/',
          formData
        )

        this.$emit('uploadArticleImg', res.data.id)
        this.$emit('uploadArticleImgPath', res.data.path)
        file.url = res.data.path

        this.fileList.push(file)
      } catch (e) {
        this.$responseError(e.response)
      }

      return false
    },
  },
}
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
