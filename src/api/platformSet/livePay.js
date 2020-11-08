import request from '@/utils/request'

/*
*  获取直播流量预付款详情
* */
export function livePayDetail() {
  return request({
    url: '/pcadmin/getLiveTrafficPackageSetting',
    method: 'get'
  })
}

/*
*  设置直播流量预付款
* */
export function livePaySet({ payList, remark }) {
  return request({
    url: '/pcadmin/setLiveTrafficPackageSetting',
    method: 'post',
    data: {
      value: {
        fee: payList,
        remark
      }
    }
  })
}
