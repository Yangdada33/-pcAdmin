import request from '@/utils/request'

/*
*  提现
* */
export function applyWithdraw({ activity_id, amount }) {
  return request({
    url: '/pcadmin/applyWithdraw',
    method: 'post',
    data: {
      activity_id,
      amount
    }
  })
}

/*
*  交易明细列表
* */
export function financeDetail({ activity_id, page, limit }) {
  return request({
    url: '/pcadmin/financeDetail',
    method: 'get',
    params: {
      activity_id,
      page,
      limit
    }
  })
}

