import request from '@/utils/request'

/*
 * 活动/草稿列表
 * */
export function activityList({ index, size, keyword, startTime, endTime, sponsorId, status }) {
  return request({
    url: '/pcadmin/getActivityList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      keyword,
      start_time: startTime,
      end_time: endTime,
      hoster_id: sponsorId,
      status // 类型: 0-未发布活动 1-已发布活动
    }
  })
}

/*
*  一键复制活动
* */
export function activityCopy(activityId) {
  return request({
    url: '/pcadmin/copyActivity',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  发布活动
* */
export function activityPublish(activityId) {
  return request({
    url: '/pcadmin/releaseActivity',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  删除活动
* */
export function activityDelete(activityId) {
  return request({
    url: '/pcadmin/deleteActivity',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  取消活动关联的管理员
* */
export function activityAdminUnRelate({ activityId, adminId }) {
  return request({
    url: '/pcadmin/deleteUserManager',
    method: 'post',
    data: {
      activity_id: activityId,
      id: adminId
    }
  })
}

/*
*  邀请活动管理员
* */
export function activityAdminInvite(activityId) {
  return request({
    url: '/pcadmin/inviteActivityAdmin',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
 *  获取注册码(活动/kpi注册)
 * */
export function activityQrCodeData({ activityId, type }) {
  return request({
    url: '/pcadmin/getQrCode',
    method: 'post',
    data: {
      activity_id: activityId,
      type // 二维码类型: 1-活动二维码 2-kpi注册码
    }
  })
}
