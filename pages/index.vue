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
              <a-button icon="file-text">Check out all articles</a-button>
            </nuxt-link>
            <nuxt-link to="/authors">
              <a-button icon="team">Check out all authors </a-button>
            </nuxt-link>
            <!-- <nuxt-link to="/stocks">
              <a-button icon="bar-chart"> Find Stock </a-button>
            </nuxt-link> -->
          </div>
        </a-col>
        <a-col :xs="24" :sm="0">
          <div class="mt-12"></div>
        </a-col>
        <a-col :xs="24" :sm="12">
          <div class="text-right">
            <div class="right-title">
              For author, you can share your idea on how to invest stock
            </div>
            <div class="right-sub-title">
              You might get sponsor from sharing your idea
            </div>
            <a-button type="primary" icon="form" @click="registerAuthor()">
              Register as Author
            </a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="content">
      <ul>
        <li>Newest Articles</li>
        <li>Newest Authors</li>
        <li>Top article of the Month</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  auth: false,
  head() {
    return {
      title: 'Home',
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  methods: {
    registerAuthor() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
        return
      }
      if (this.loggedInUser.is_author) {
        this.$router.push('/profile/author')
        return
      }
      this.$router.push('/profile/author-registration')
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  background-image: linear-gradient(to right, #5c6bc0, #ab47bc);
  padding: 0 16px 16px 16px;
  color: whitesmoke;

  .left-title {
    font-size: 24px;
    font-weight: bold;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .right-title {
    font-size: 24px;
    line-height: 1.2;
  }
  .right-sub-title {
    font-size: 16px;
    margin-bottom: 8px;
  }
}
.content {
  margin: 16px;
}
</style>
