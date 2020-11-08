import request from '@/utils/request'

/*
*  获取费用设置详情
* */
export function expenseDetail() {
  return request({
    url: '/pcadmin/getCostSetting',
    method: 'get'
  })
}

/*
*  设置费用
* */
export function expenseSet({ notePrice, noteNum, activityPrice }) {
  return request({
    url: '/pcadmin/costSetting',
    method: 'post',
    data: {
      sms_fee: notePrice,
      SMS_warning_value: noteNum,
      activity_warning_value: activityPrice
    }
  })
}
