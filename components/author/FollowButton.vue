<template>
  <a-button
    v-if="isFollowing"
    :type="isHover ? 'danger' : 'default'"
    @click="unfollow()"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    {{ isHover ? 'Unfollow' : 'Following' }}
  </a-button>
  <a-button v-else type="primary" @click="follow()"> Follow </a-button>
</template>

<script>
export default {
  props: {
    authorId: {
      type: Number,
      required: true,
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHover: false,
    }
  },
  methods: {
    async follow() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
        return
      }
      try {
        await this.$axios.post(`/api/authors/${this.authorId}/follow/`)
        this.$emit('followed')
      } catch (e) {
        this.$responseError(e.response)
      }
    },
    async unfollow() {
      if (!this.$auth.loggedIn) {
        this.$router.push('/login')
        return
      }
      try {
        await this.$axios.post(`/api/authors/${this.authorId}/unfollow/`)
        this.$emit('unfollowed')
      } catch (e) {
        this.$responseError(e.response)
      }
    },
  },
}
</script>
