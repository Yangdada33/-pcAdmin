import request from '@/utils/request'

/*
 * 获取流量充值记录
 * */
export function rechargeList({ index, size, type }) {
  return request({
    url: '/pcadmin/getRechargeLog',
    methods: 'get',
    params: {
      page: index,
      limit: size,
      type // 类型: 10-短信账户 11-推广账户 12-奖金账户 13-直播账户
    }
  })
}
