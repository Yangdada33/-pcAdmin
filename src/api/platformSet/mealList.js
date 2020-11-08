import request from '@/utils/request'

/*
* 获取套餐列表
* */
export function mealList() {
  return request({
    url: '/pcadmin/organizerPackageList',
    method: 'get'
  })
}

/*
* 获取套餐详情
* */
export function mealDetail(id) {
  return request({
    url: '/pcadmin/getOrganizerPackageById',
    method: 'get',
    params: {
      id
    }
  })
}

/*
*  新增套餐
* */
export function mealAdd({ type, times, price, remark }) {
  return request({
    url: '/pcadmin/addOrganizerPackage',
    method: 'post',
    data: {
      type,
      item: [{
        times,
        price,
        remark
      }]
    }
  })
}

/*
*  修改套餐
* */
export function mealEdit({ id, times, price, remark }) {
  return request({
    url: '/pcadmin/updateOrganizerPackage',
    method: 'post',
    data: {
      id,
      times,
      price,
      remark
    }
  })
}

/*
*  删除套餐
* */
export function mealDelete(idList) {
  return request({
    url: '/pcadmin/deleteOrganizerPackage',
    method: 'post',
    data: {
      ids: idList
    }
  })
}
