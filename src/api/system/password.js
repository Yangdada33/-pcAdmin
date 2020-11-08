import request from '@/utils/request'

/*
* 重置密码
* */
export function resetPassword({ oldPassword, newPassword, surePassword }) {
  return request({
    url: '/pcadmin/changePassword',
    method: 'post',
    data: {
      password: oldPassword,
      new_password: newPassword,
      confirm_password: surePassword
    }
  })
}
