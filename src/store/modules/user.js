import { login, getInfo, getMenuList } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { roleTypeData } from '@/utils/data'
const defaultAvatar = require('@/assets/index/avatar_default.png')

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: defaultAvatar,
    userInfo: {}, // 用户信息
    menuList: [] // 菜单列表
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER_INFO: (STATE, userInfo) => {
    state.userInfo = userInfo
  },
  SET_MENU_LIST: (state, menuList) => {
    state.menuList = menuList
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, mobile, code, type } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, mobile: mobile.trim(), code, type }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { user_info, true_name, type, live_url } = data
        if (user_info) {
          const { name, avatar } = user_info
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
        } else {
          commit('SET_NAME', true_name)
        }

        const roles = [roleTypeData[type]] // type: 账号类型 0-平台账号 1-主办方账号
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_USER_INFO', data)
        commit('live/SET_LIVE_WEB_SOCKET_URL', live_url, { root: true })

        resolve({ ...data, roles })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get menu list
  getMenuList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenuList().then((response) => {
        const { data } = response
        commit('SET_MENU_LIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove token first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove token first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

