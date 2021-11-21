<template>
  <div>
    <div class="header">
      <a-row>
        <a-col :xs="24" :sm="12">
          <div class="left-title">
            For Investor, you can find idea at here to invest stock
          </div>
          <div>
            <nuxt-link to="/articles">
              <a-button icon="file-text"> View All Articles </a-button>
            </nuxt-link>
            <nuxt-link to="/stocks">
              <a-button icon="bar-chart"> Find Stock </a-button>
            </nuxt-link>
          </div>
        </a-col>
        <a-col :xs="24" :sm="12">
          <div class="text-right">
            <div class="right-title">
              For author, you can share your idea on how to invest stock
            </div>
            <div class="right-sub-title">
              You might get tips from sharing your idea
            </div>
            <a-button type="primary" to="/profile/register-author" icon="form">
              Become Author
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="">
      <div class="">
        <FrontNewArticleList />
        <div class=""></div>
        <div class=""></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
<style lang="less" scoped>
.header {
  background-image: linear-gradient(to right, #5c6bc0, #ab47bc);
  padding: 16px;
  color: whitesmoke;
}
.left-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.right-title {
  font-size: 24px;
}
.right-sub-title {
  font-size: 16px;
  margin-bottom: 12px;
}
</style>
