import request from '@/utils/request'

/*
* 重置手机号
* */
export function resetPhone({ oldPhone, newPhone, surePhone }) {
  return request({
    url: '/pcadmin/changeMobile',
    method: 'post',
    data: {
      mobile: oldPhone,
      new_mobile: newPhone,
      confirm_mobile: surePhone
    }
  })
}
