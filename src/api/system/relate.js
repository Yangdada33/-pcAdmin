import request from '@/utils/request'

/*
*  获取用户绑定微信状态
* */
export function wechatRelateValidate() {
  return request({
    url: '/pcadmin/checkWechat',
    method: 'post'
  })
}

/*
*  用户关联微信
* */
export function wechatRelateSet(userId) {
  return process.env.VUE_APP_BASE_API + '/pcadmin/bindWx/' + userId
}
export function wechatRelateSetWidthCode(wxCode) {
  return request({
    url: '/pcadmin/bindWx',
    method: 'post',
    data: {
      code: wxCode
    }
  })
}

/*
*  用户解除微信关联
* */
export function wechatUnRelateSet() {
  return request({
    url: '/pcadmin/unbindWx',
    method: 'post'
  })
}
