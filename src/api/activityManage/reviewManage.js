import request from '@/utils/request'

/*
*  获取素材审核列表
* */
export function examineList({ activity_id, status, page, limit, source }) {
  return request({
    url: '/pcadmin/rawMaterialList',
    method: 'post',
    data: {
      activity_id: activity_id,
      status: status,
      page: page,
      limit: limit,
      source: source
    }
  })
}
/*
*  素材审核
* */
export function checkRawMaterial({ activity_id, ids, action }) {
  return request({
    url: '/pcadmin/checkRawMaterial',
    method: 'post',
    data: {
      activity_id: activity_id,
      ids: ids,
      action: action
    }
  })
}
/*
*  素材收藏
* */
export function collectRawMaterial({ activity_id, ids, action }) {
  return request({
    url: '/pcadmin/collectRawMaterial',
    method: 'post',
    data: {
      activity_id: activity_id,
      ids: ids,
      action: action
    }
  })
}
/*
*  员工注册列表
* */
export function userAdminList({ activity_id, status, page, limit }) {
  return request({
    url: '/pcadmin/userAdminList',
    method: 'post',
    data: {
      activity_id: activity_id,
      status: status,
      page: page,
      limit: limit
    }
  })
}
/*
*  员工审核
* */
export function checkAdminUser({ activity_id, ids, act }) {
  return request({
    url: '/pcadmin/checkAdminUser',
    method: 'post',
    data: {
      activity_id: activity_id,
      ids: ids,
      act: act
    }
  })
}
/*
*  提现审核列表
* */
export function withdrawalList({ activity_id, page, status, limit }) {
  return request({
    url: '/pcadmin/withdrawalList',
    method: 'post',
    data: {
      activity_id: activity_id,
      status: status,
      page: page,
      limit: limit
    }
  })
}
/*
*  提现审核
* */
export function checkWithdrawal({ activity_id, ids, act }) {
  return request({
    url: '/pcadmin/checkWithdrawal',
    method: 'post',
    data: {
      activity_id: activity_id,
      ids: ids,
      act: act
    }
  })
}
/*
*  挑战审核列表
* */
export function challengeList({ activity_id, page, is_check, limit }) {
  return request({
    url: '/pcadmin/challengeList',
    method: 'post',
    data: {
      activity_id: activity_id,
      page: page,
      is_check: is_check,
      limit: limit
    }
  })
}

/*
*  挑战审核
* */
export function checkChallenge({ activity_id, id, action }) {
  return request({
    url: '/pcadmin/checkChallenge',
    method: 'post',
    data: {
      activity_id: activity_id,
      id: id,
      action: action
    }
  })
}
