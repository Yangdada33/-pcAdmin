import request from '@/utils/request'

/*
*  提现审核列表
* */
export function hosterWithdrawaList({ status, page, limit }) {
  return request({
    url: '/pcadmin/hosterWithdrawaList',
    method: 'post',
    data: {
      status,
      page,
      limit
    }
  })
}
/*
*  提现审核
* */
export function hosterCheckWithdrawal({ activity_id, id, act }) {
  return request({
    url: '/pcadmin/hosterCheckWithdrawal',
    method: 'post',
    data: {
      activity_id,
      id,
      act
    }
  })
}
