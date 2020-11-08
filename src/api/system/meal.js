import request from '@/utils/request'

/*
*  获取用户套餐
* */
export function userMealData() {
  return request({
    url: '/pcadmin/setmeal',
    method: 'post'
  })
}
