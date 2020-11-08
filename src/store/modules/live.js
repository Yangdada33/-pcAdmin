const state = {
  liveWebSocketUrl: '',
  liveData: {}
}

const mutations = {
  SET_LIVE_WEB_SOCKET_URL(state, liveWebSocketUrl) {
    state.liveWebSocketUrl = liveWebSocketUrl
  },
  SET_LIVE_DATA(state, liveData) {
    state.liveData = liveData
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
