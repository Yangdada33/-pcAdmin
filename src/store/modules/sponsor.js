const state = {
  sponsorData: {}
}

const mutations = {
  SET_SPONSOR_DATA(state, sponsorData) {
    state.sponsorData = sponsorData
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
