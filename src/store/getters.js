const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  topPath: state => state.app.topPath,
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  sponsorData: state => state.sponsor.sponsorData,
  templateList: state => state.activity.templateList,
  activityData: state => state.activity.activityData,
  moduleList: state => state.activity.moduleList,
  taskData: state => state.activity.taskData,
  challengeData: state => state.activity.challengeData,
  goodsTimeData: state => state.activity.goodsTimeData,
  giftData: state => state.activity.giftData,
  liveWebSocketUrl: state => state.live.liveWebSocketUrl,
  liveData: state => state.live.liveData
}
export default getters
