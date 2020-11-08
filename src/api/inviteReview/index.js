import request from '@/utils/request'

/*
 * 超级管理员和活动管理员 列表
 * */
export function getApplyUserManager({ role_id, status, page, limit, hoster_id }) {
  return request({
    url: '/pcadmin/getApplyUserManager',
    methods: 'get',
    params: {
      role_id,
      status,
      page,
      limit,
      hoster_id
    }
  })
}

/*
*  超级管理员和活动管理员 审核
* */
export function doApplyUserManager({ activity_id, id, status }) {
  return request({
    url: '/pcadmin/doApplyUserManager',
    method: 'post',
    data: {
      activity_id,
      id,
      status
    }
  })
}

/*
 * 主播 列表
 * */
export function getCheckAnchorList({ status, page, limit }) {
  return request({
    url: '/pcadmin/getCheckAnchorList',
    methods: 'get',
    params: {
      status,
      page,
      limit
    }
  })
}

/*
*  主播 审核
* */
export function checkAnchor({ activity_id, id, status }) {
  return request({
    url: '/pcadmin/checkAnchor',
    method: 'post',
    data: {
      activity_id,
      id,
      status
    }
  })
}
