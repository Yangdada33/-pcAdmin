import request from '@/utils/request'

/*
 *  获取系统消息列表
 * */
export function messageList({ index, size }) {
  return request({
    url: '/pcadmin/systemMessage',
    method: 'post',
    data: {
      page: index,
      limit: size
    }
  })
}

/**
 *  设置消息已读状态
 * */
export function messageReadSet(messageid) {
  return request({
    url: '/pcadmin/readMessage',
    method: 'post',
    data: {
      id: messageid
    }
  })
}
