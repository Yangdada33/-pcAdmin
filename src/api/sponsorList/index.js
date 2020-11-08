import request from '@/utils/request'

/*
*  获取主办方列表
* */
export function sponsorList({ index, size, keyword, startTime, endTime }) {
  return request({
    url: '/pcadmin/getHosterList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      keyword,
      start_time: startTime,
      end_time: endTime
    }
  })
}

/*
*  获取主办方列表(不带分页)
* */
export function sponsorListWithNoPage() {
  return request({
    url: '/pcadmin/getAllHosterList',
    method: 'get'
  })
}

/*
 * 数据总览
 * */
export function mainList({ type, sponsorId }) {
  return request({
    url: '/pcadmin/main',
    methods: 'get',
    params: {
      type,
      sponsor_id: sponsorId
    }
  })
}

/*
*  导出数据
* */
export function hosterExport({ keyword, start_time, end_time }) {
  return request({
    url: '/pcadmin/hosterExport',
    method: 'post',
    data: {
      keyword,
      start_time,
      end_time
    }
  })
}
