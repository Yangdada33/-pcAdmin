import request from '@/utils/request'

/*
 * 客户留言列表
 * */
export function recordList({ index, size }) {
  return request({
    url: '/pcadmin/getCooperationList',
    methods: 'get',
    params: {
      page: index,
      limit: size
    }
  })
}
