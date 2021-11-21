export const getters = {
  loggedInUser: (state) => {
    return state.auth.user
  },
  isAuthenticated: (state) => {
    return state.auth.loggedIn
  },
}
