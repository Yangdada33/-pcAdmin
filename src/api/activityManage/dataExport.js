import request from '@/utils/request'

/*
*  获取导出的表格数据
* */
export function tableDataList({ activityId, export_id, search, startTime, endTime, page, limit }) {
  return request({
    url: '/pcadmin/showList',
    method: 'post',
    data: {
      activity_id: activityId,
      export_id: export_id,
      search: search,
      start_time: startTime,
      end_time: endTime,
      page: page,
      limit: limit
    }
  })
}
/*
*  导出数据
* */
export function dataExport({ activityId, export_id, search, startTime, endTime }) {
  return request({
    url: '/pcadmin/doExport',
    method: 'post',
    data: {
      activity_id: activityId,
      export_id: export_id,
      search: search,
      start_time: startTime,
      end_time: endTime
    }
  })
}

/*
*  活动数据总览
* */
export function dataSummary({ activityId, time_tag }) {
  return request({
    url: '/pcadmin/dataSummary',
    method: 'post',
    data: {
      activity_id: activityId,
      time_tag: time_tag
    }
  })
}
