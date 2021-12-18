<template>
  <div>
    <div class="note">
      <div>Note</div>
      <div>* Paragraph / picture title can be blank</div>
      <div>
        * If you are author with less or no followers, it is advise that do not
        tick "Only your supporter can view"
      </div>
      <div>* Please only tick "Publish" if your article is ready to read</div>
    </div>
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
    <a-divider>Paragraphs / Pictures</a-divider>
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
      <a-input
        v-model="para.paragraph_title"
        placeholder="Title"
        class="mb-8"
      />
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
    <br />
    <br />
    <a-select
      v-model="selectedTopicList"
      mode="multiple"
      style="width: 100%"
      placeholder="Topic"
      option-filter-prop="label"
    >
      <a-select-option
        v-for="t in topicList"
        :key="t.id"
        :value="t.id"
        :label="t.topic_name"
      >
        {{ t.topic_name }}
      </a-select-option>
    </a-select>
    <a-select
      v-model="selectedStockCounterList"
      mode="multiple"
      style="width: 100%"
      placeholder="Stock"
      option-filter-prop="label"
      :filter-option="false"
      show-search
      class="mt-8"
      @search="fetchStockCounter"
    >
      <template v-if="stockCounter.isFetching" #notFoundContent>
        <a-spin size="small" />
      </template>
      <a-select-option
        v-for="sc in stockCounter.list"
        :key="sc.id"
        :value="sc.id"
        :label="sc.stock_symbol"
      >
        {{ sc.stock_symbol }}
      </a-select-option>
    </a-select>
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
    topicList: {
      type: Array,
      default: () => [],
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
          paragraph_title: '',
          content: '',
          article_img: null,
          article_img_path: null,
        },
      ],
      topics: [],
      stock_counters: [],
    }

    let selectedTopicList = []
    let selectedStockCounterList = []

    let scList = []

    if (this.mode === 'update' && this.data) {
      article = _.cloneDeep(this.data)
      selectedTopicList = article.topics.map((x) => x.topic)
      selectedStockCounterList = article.stock_counters.map(
        (x) => x.stock_counter
      )
      scList = article.stock_counters.map((x) => {
        return { id: x.stock_counter, stock_symbol: x.stock_symbol }
      })
    }

    return {
      article,
      selectedTopicList,
      selectedStockCounterList,

      stockCounter: {
        list: scList,
        isFetching: false,
      },
    }
  },
  methods: {
    fetchStockCounter: _.debounce(async function (value) {
      this.stockCounter.isFetching = true
      this.stockCounter.list = []
      await new Promise((resolve) => setTimeout(resolve, 300))
      this.stockCounter.list = (
        await this.$axios.get('/api/stock/counters/', {
          params: {
            sorter: {
              field: 'stock_symbol',
              order: 'asc',
            },
            select: {
              fields: ['stock_symbol'],
              value,
              size: 20,
            },
            fields: ['id', 'stock_symbol'],
          },
        })
      ).data
      this.stockCounter.isFetching = false
    }, 500),
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
        paragraph_title: '',
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
        paragraph_title: '',
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

      const tempTopicList = []
      this.selectedTopicList.forEach((x) => {
        const exist = this.data
          ? this.data.topics.find((y) => y.topic === x)
          : null
        if (exist) {
          tempTopicList.push({
            id: exist.id,
            topic: x,
          })
        } else {
          tempTopicList.push({
            topic: x,
          })
        }
      })

      const tempStockCounterList = []
      this.selectedStockCounterList.forEach((x) => {
        const exist = this.data
          ? this.data.stock_counters.find((y) => y.stock_counter === x)
          : null
        if (exist) {
          tempStockCounterList.push({
            id: exist.id,
            stock_counter: x,
          })
        } else {
          tempStockCounterList.push({
            stock_counter: x,
          })
        }
      })

      this.article.topics = tempTopicList
      this.article.stock_counters = tempStockCounterList

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

.note {
  margin-bottom: 16px;
  color: red;
  font-size: 12px;
}
</style>
