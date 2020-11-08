import request from '@/utils/request'

/*
*  获取短信列表
* */
export function noteList({ type, sponsorId, limit, is_page }) {
  return request({
    url: '/pcadmin/getMaterialList',
    method: 'get',
    params: {
      type: type,
      sponsor_id: sponsorId,
      limit: limit,
      is_page: is_page
    }
  })
}
