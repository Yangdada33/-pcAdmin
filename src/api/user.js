import request from '@/utils/request'

export const appId = 'wx4af6b22323c284d2'

/*
* 登录
* */
export function login({ username, password, mobile, code, wxCode, type }) {
  switch (type) {
    case 1: // 扫码
      return request({
        url: '/sso/pcScanCodeLogin',
        method: 'get',
        params: {
          app_id: 10004,
          code: wxCode
        }
      })
    case 2: // 账号密码
      return request({
        url: '/sso/pcAccountLogin', // /vue-admin-template/user/login
        method: 'post',
        data: {
          account: username,
          password,
          app_id: 10003
        }
      })
    case 3: // 手机号
      return request({
        url: '/sso/pcPasswordLogin',
        method: 'post',
        data: {
          mobile,
          code,
          app_id: 10003
        }
      })
  }
}

/*
* 发送短信验证码
* */
export function noteCode(mobile) {
  return request({
    url: '/pcadmin/sendSmsCode',
    method: 'post',
    data: {
      mobile
    }
  })
}

/*
* 获取用户信息
* */
export function getInfo() {
  return request({
    url: '/pcadmin/getUserInfo',
    method: 'get'
  })
}

/*
* 获取菜单列表
* */
export function getMenuList() {
  return request({
    url: '/pcadmin/getAdminUserMenu',
    method: 'get'
  })
}

/*
*  文件上传
* */
export function fileUpload(file) {
  let fileType = file.type.split('/')[0]
  !['image', 'video'].includes(fileType) && (fileType = 'other')
  const formData = new FormData() // 构造一个 FormData，把后台需要发送的参数添加
  formData.append('file', file) // 接口需要传的参数
  formData.append('type', fileType) // 资源类型：video 视频 image 图片 other 其它
  return request({
    url: '/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: formData
  })
}
