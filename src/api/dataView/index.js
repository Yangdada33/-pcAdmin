import request from '@/utils/request'

/*
 * 数据总览
 * */
export function mainList({ type, start_time, end_time }) {
  return request({
    url: '/pcadmin/main',
    methods: 'get',
    params: {
      type,
      start_time,
      end_time
    }
  })
}
