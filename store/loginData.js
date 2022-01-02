export const state = () => ({
  redirectUri: null,
})

export const mutations = {
  set(state, uri) {
    state.redirectUri = uri
  },
  reset(state) {
    state.redirectUri = null
  },
}
