<template>
  <div class="exception">
    <div class="imgBlock">
      <!-- <div class="imgEle" :style="{backgroundImage: `url(${types[error.statusCode].img})`}" /> -->
      <img :src="types[error.statusCode].img" class="imgEle" />
    </div>
    <div class="content">
      <h1>{{ types[error.statusCode].title }}</h1>
      <div v-if="error.message" class="desc">
        {{ error.message }}
      </div>
      <div v-else class="desc">
        {{ types[error.statusCode].desc }}
        <br />
        {{ types[error.statusCode].descCn }}
      </div>
      <div>
        <nuxt-link to="/">
          <a-button type="primary"> Return to Home </a-button>
        </nuxt-link>
        <a-button @click="$router.go(-1)"> Back </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {
        return { statusCode: 404 }
      },
    },
  },
  data() {
    return {
      types: {
        403: {
          img: '/Error403.svg',
          title: 'Forbidden 403',
          desc: "Sorry, You don't have permission to access the page you requested",
          descCn: '抱歉，你无权访问该页面',
        },
        404: {
          img: '/Error404.svg',
          title: 'Page Not Found 404',
          desc: 'Sorry, The page you requested count not be found',
          descCn: '抱歉，你访问的页面不存在或仍在开发中',
        },
        500: {
          img: '/Error500.svg',
          title: 'Server Error 500',
          desc: 'Sorry, something went wrong, please try again',
          descCn: '抱歉，服务器出错了',
        },
      },
    }
  },
  head() {
    return { title: this.types[this.error.statusCode].title }
  },
}
</script>

<style lang="less" scoped>
.exception {
  display: flex;
  align-items: center;
  height: 80%;
  min-height: 600px;
  .imgBlock {
    flex: 0 0 50%;
    width: 50%;
    padding-right: 100px;
    zoom: 1;
    &::before,
    &::after {
      content: ' ';
      display: table;
    }
    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }
  }
  .imgEle {
    float: right;
    width: 100%;
    max-width: 430px;
    height: 360px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
  }
  .content {
    flex: auto;
    h1 {
      margin-bottom: 24px;
      color: #434e59;
      font-weight: 600;
      font-size: 64px;
      line-height: 72px;
    }
    .desc {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
    }
  }
}
</style>
