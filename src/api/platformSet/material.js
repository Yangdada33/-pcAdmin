import request from '@/utils/request'

/*
*  获取素材列表
* */
export function materialList({ index, size, type, activityId, liveId, sponsorId, pageStatus = true }) {
  return request({
    url: '/pcadmin/getMaterialList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      type, // 类型：0-短信 1-直播素材 2-音乐
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播id
      sponsor_id: sponsorId, // 主办方id
      is_page: pageStatus // 是否分页
    }
  })
}

/*
*  新增素材
* */
export function materialAdd({ type, activityId, liveId, content, resourceId }) {
  return request({
    url: '/pcadmin/addMaterial',
    method: 'post',
    data: {
      type,
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播id
      content,
      resource_id: resourceId
    }
  })
}

/*
*  修改素材
* */
export function materialEdit({ id, type, activityId, liveId, content, resourceId }) {
  return request({
    url: '/pcadmin/updateMaterial',
    method: 'post',
    data: {
      id,
      type,
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播id
      content,
      resource_id: resourceId
    }
  })
}

/*
*  删除素材
* */
export function materialDelete({ id, activityId, liveId }) {
  return request({
    url: '/pcadmin/deleteMaterial',
    method: 'get',
    params: {
      id,
      activity_id: activityId, // 活动id
      live_id: liveId // 直播id
    }
  })
}

/*
*  获取微信素材列表
* */
export function wechatMaterialList({ index, size, sponsorId }) {
  return request({
    url: '/pcadmin/rawMaterialList',
    method: 'post',
    data: {
      page: index,
      limit: size,
      activity_id: '', // 活动id
      status: 1, // 素材状态 0 未审核 1已审核 2未通过
      source: 'system', // 来源 system 系统上传 users 用户上传
      sponsor_id: sponsorId // 主办方id
    }
  })
}

/*
*  新增微信素材
* */
export function wechatMaterialAdd({ content, resourceIds }) {
  return request({
    url: '/pcadmin/addRawMaterial',
    method: 'post',
    data: {
      content,
      resource_ids: resourceIds
    }
  })
}

/*
*  修改微信素材
* */
export function wechatMaterialEdit({ id, content, resourceIds }) {
  return request({
    url: '/pcadmin/updateRawMaterial',
    method: 'post',
    data: {
      id,
      content,
      resource_ids: resourceIds
    }
  })
}

/*
*  删除微信素材
* */
export function wechatMaterialDelete({ id }) {
  return request({
    url: '/pcadmin/deleteRawMaterial',
    method: 'get',
    params: {
      id
    }
  })
}

/*
*  获取敏感词库
* */
export function wordMaterialList() {
  return request({
    url: '/pcadmin/getCommonSensitiveWords',
    method: 'get'
  })
}

/*
*  设置敏感词库
* */
export function wordMaterialSet(wordList) {
  return request({
    url: '/pcadmin/setCommonSensitiveWords',
    method: 'post',
    data: {
      words: wordList
    }
  })
}
