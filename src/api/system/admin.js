import request from '@/utils/request'

/*
*  获取超级管理员列表
* */
export function superAdminList({ index, size, roleType }) {
  return request({
    url: '/pcadmin/superAdminList',
    method: 'post',
    data: {
      page: index,
      limit: size,
      role: roleType // 角色类型：6-活动管理员 7-超级管理员
    }
  })
}

/*
*  新增超级管理员
* */
export function superAdminAdd({ mobile, password, roleType }) {
  return request({
    url: '/pcadmin/addAdmin',
    method: 'post',
    data: {
      mobile, // 账号（手机号）
      password, // 密码
      role_id: roleType //	 角色类型: 6-活动管理员 7-超级管理员
    }
  })
}

/*
*  删除超级管理员
* */
export function superAdminDelete(adminId) {
  return request({
    url: '/pcadmin/deleteAdmin',
    method: 'post',
    data: {
      id: adminId
    }
  })
}

/*
*  邀请超级管理员
* */
export function superAdminInvite() {
  return request({
    url: '/pcadmin/inviteSuperAdmin',
    method: 'post'
  })
}
