import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import sponsor from './modules/sponsor'
import activity from './modules/activity'
import live from './modules/live'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    sponsor,
    activity,
    live
  },
  getters
})

export default store
