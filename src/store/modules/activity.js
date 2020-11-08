import { activityBaseDetail, activityTemplateList } from '@/api/activityManage/baseSet'
import { activityModuleData } from '@/utils/data'
import { deepClone } from '@/utils/index'

const state = {
  activityData: {}, // 活动数据
  templateList: [], // 活动模板列表
  moduleList: [], // 二级菜单列表 [{ path: '', children: [] }]
  taskData: {}, // 任务记录详情
  challengeData: {}, // 挑战记录详情
  goodsTimeData: {}, // 秒杀商品详情
  giftData: {} // 礼品详情
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
  setActivityData(state, activityData) {
    mutations.CHANGE_SETTING(state, { key: 'activityData', value: activityData })
  },
  setModuleList(state, moduleList) {
    mutations.CHANGE_SETTING(state, { key: 'moduleList', value: moduleList })
  },
  setTaskData(state, taskData) {
    mutations.CHANGE_SETTING(state, { key: 'taskData', value: taskData })
  },
  setChallengeData(state, challengeData) {
    mutations.CHANGE_SETTING(state, { key: 'challengeData', value: challengeData })
  },
  setGoodsTimeData(state, goodsTimeData) {
    mutations.CHANGE_SETTING(state, { key: 'goodsTimeData', value: goodsTimeData })
  },
  setGiftData(state, giftData) {
    mutations.CHANGE_SETTING(state, { key: 'giftData', value: giftData })
  }
}

const actions = {
  setActivityData({ commit }, { activityData, defaultModuleList }) {
    return new Promise((resolve, reject) => {
      activityBaseDetail(activityData.id).then(response => {
        const resultData = response.data
        commit('CHANGE_SETTING', { key: 'activityData', value: { ...activityData, ...resultData }})
        // 动态设置二级侧边栏
        const defaultModuleListClone = deepClone(defaultModuleList)
        if (resultData.menu && resultData.menu.length && defaultModuleListClone[0].path === 'baseSet') {
          const moduleChildList = resultData.menu.map(item => activityModuleData[item.tag].path)
          moduleChildList.includes('banner') && moduleChildList.push('bannerLocation')
          defaultModuleListClone.splice(1, 0, { path: 'marketModuleSet', children: moduleChildList })
        }
        commit('CHANGE_SETTING', { key: 'moduleList', value: defaultModuleListClone })
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  setTemplateList({ commit }) {
    return new Promise((resolve, reject) => {
      activityTemplateList().then(response => {
        commit('CHANGE_SETTING', { key: 'templateList', value: response.data })
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

