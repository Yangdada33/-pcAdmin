import request from '@/utils/request'

/*
*  获取活动阶段数据
* */
export function stepDetail(activityId, type = '') {
  return request({
    url: '/pcadmin/getActivityPeriodList',
    method: 'get',
    params: {
      activity_id: activityId,
      type
    }
  })
}

/*
*  设置活动阶段
*  stepList: [{ name: '', start_time: '', end_time: '' }]
* */
export function stepSet({ activityId, stepList }) {
  return request({
    url: '/pcadmin/updateActivityPeriod',
    method: 'post',
    data: {
      activity_id: activityId,
      period: stepList
    }
  })
}

/*
*  获取阶段任务列表
* */
export function taskList(activityId) {
  return request({
    url: '/pcadmin/getActivityPeriodTaskList',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  新增阶段任务
*  taskList: [{ project_id: '', times: '', punishment: '' }]
* */
export function taskAdd({ activityId, step, type, prize, projectList }) {
  return request({
    url: '/pcadmin/addActivityPeriodTask',
    method: 'post',
    data: {
      activity_id: activityId,
      reward: prize,
      period_id: step,
      level: type,
      content: projectList
    }
  })
}

/*
*  修改阶段任务
*  taskList: [{ project_id: '', times: '', punishment: '' }]
* */
export function taskEdit({ activityId, id, step, type, prize, projectList }) {
  return request({
    url: '/pcadmin/updateActivityPeriodTask',
    method: 'post',
    data: {
      id,
      activity_id: activityId,
      reward: prize,
      period_id: step,
      level: type,
      content: projectList
    }
  })
}

/*
*  删除阶段任务
* */
export function taskDelete({ activityId, idList }) {
  return request({
    url: '/pcadmin/deleteActivityPeriodTask',
    method: 'post',
    data: {
      activity_id: activityId,
      ids: idList
    }
  })
}

/*
*  获取项目列表
* */
export function projectList(activityId) {
  return request({
    url: '/pcadmin/getActivityProjectList',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  获取PK列表
* */
export function pkList({ index, size, activityId }) {
  return request({
    url: '/pcadmin/getPKList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      activity_id: activityId
    }
  })
}

/*
*  获取PK详情
* */
export function pkDetail({ activityId, pkId }) {
  return request({
    url: '/pcadmin/getPKByID',
    method: 'get',
    params: {
      activity_id: activityId,
      id: pkId
    }
  })
}

/*
*  新增pk
* */
export function pkAdd({ activityId, type, object: { left, right }, step, projectList, money }) {
  return request({
    url: '/pcadmin/addPk',
    method: 'post',
    data: {
      amount: money,
      level: type,
      uid: left[left.length - 1],
      bid: right[right.length - 1],
      activity_id: activityId,
      period_id: step,
      project_ids: projectList
    }
  })
}

/*
*  删除PK
* */
export function pkDelete({ activityId, pkId }) {
  return request({
    url: '/pcadmin/deletePk',
    method: 'get',
    params: {
      activity_id: activityId,
      id: pkId
    }
  })
}

/*
*  获取pk对象列表
* */
export function pkObjectList(activityId, type) {
  return request({
    url: '/pcadmin/getAdminCatListByLevel',
    method: 'get',
    params: {
      activity_id: activityId,
      level: type // pk类型 1品牌 2门店 10个人
    }
  })
}

/*
*  获取挑战列表
* */
export function challengeList(activityId) {
  return request({
    url: '/pcadmin/getChallengeProjectList',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  获取挑战详情
* */
export function challengeDetail({ activityId, step }) {
  return request({
    url: '/pcadmin/getChallengeProjectById',
    method: 'get',
    params: {
      activity_id: activityId,
      period_id: step
    }
  })
}

/*
*  新增挑战
* */
export function challengeAdd({ activityId, type, step, levelList }) {
  return request({
    url: '/pcadmin/addChallengeProjects',
    method: 'post',
    data: {
      type,
      activity_id: activityId,
      period_id: step,
      level: levelList
    }
  })
}

/*
*  修改挑战
* */
export function challengeEdit({ activityId, id, type, step, levelList }) {
  console.log({ activityId, id, type, step, levelList })
  return request({
    url: '/pcadmin/updateChallengeProject',
    method: 'post',
    data: {
      id,
      type,
      activity_id: activityId,
      period_id: step,
      level: levelList
    }
  })
}

/*
*  删除挑战
* */
export function challengeDelete({ activityId, type, period_id }) {
  return request({
    url: '/pcadmin/deleteChallengeProject',
    method: 'get',
    params: {
      activity_id: activityId,
      type, // 类型id
      period_id // 阶段id
    }
  })
}
