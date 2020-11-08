import request from '@/utils/request'

/*
*  获取主播列表
* */
export function anchorList(activityId) {
  return request({
    url: '/pcadmin/getAnchorList',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  新增主播
* */
export function anchorAdd({ activityId, name, mobile, userId }) {
  return request({
    url: '/pcadmin/getAnchorList',
    method: 'post',
    data: {
      activity_id: activityId,
      name, // 主播姓名
      mobile, // 手机号码
      user_id: userId // 用户id
    }
  })
}

/*
*  删除主播
* */
export function anchorDelete({ activityId, idList }) {
  return request({
    url: '/pcadmin/deleteAnchor',
    method: 'post',
    data: {
      activity_id: activityId,
      ids: idList
    }
  })
}

/*
*  获取主播邀请地址及图片
* */
export function anchorInvite(activityId) {
  return request({
    url: '/pcadmin/getAnchorInviteQrcode',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  获取直播间列表
* */
export function liveList(activityId) {
  return request({
    url: '/pcadmin/getLiveList',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  获取直播间详情
* */
export function liveDetail({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveById',
    method: 'get',
    params: {
      activity_id: activityId,
      id: liveId
    }
  })
}

/*
*  新增直播间
* */
export function liveAdd({ activityId, theme, link, anchor, startTime, endTime, notice, picture, lineBase, lineMax, praiseBase, activityDes, ruleCont }) {
  return request({
    url: '/pcadmin/createLive',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      name: theme, // 直播主题
      link, // 直播地址
      anchor_ids: anchor, // 主播ids数组
      start_time: startTime, // 直播开始时间
      end_time: endTime, // 直播结束时间
      notice, // 直播公告
      invite_img: picture, // 直播图片
      online_people: lineBase, // 在线人数基数
      online_people_max: lineMax, // 在线人数峰值
      number_of_likes: praiseBase, // 点赞基数
      live_remark: activityDes, // 直播活动说明
      welfare_rule: ruleCont // 福利发放规则
    }
  })
}

/*
*  修改直播间
* */
export function liveEdit({ activityId, id, theme, link, anchor, startTime, endTime, notice, picture, lineBase, lineMax, praiseBase, activityDes, ruleCont }) {
  return request({
    url: '/pcadmin/updateLive',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      id, // 直播id
      name: theme, // 直播主题
      link, // 直播地址
      anchor_ids: anchor, // 主播ids数组
      start_time: startTime, // 直播开始时间
      end_time: endTime, // 直播结束时间
      notice, // 直播公告
      invite_img: picture, // 直播图片
      online_people: lineBase, // 在线人数基数
      online_people_max: lineMax, // 在线人数峰值
      number_of_likes: praiseBase, // 点赞基数
      live_remark: activityDes, // 直播活动说明
      welfare_rule: ruleCont // 福利发放规则
    }
  })
}

/*
*  删除直播间
* */
export function liveDelete({ activityId, liveId }) {
  return request({
    url: '/pcadmin/deleteLive',
    method: 'get',
    params: {
      activity_id: activityId,
      id: liveId
    }
  })
}

/*
*  复制直播间
* */
export function liveCopy({ activityId, liveId }) {
  return request({
    url: '/pcadmin/copyLiveRoom',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  获取直播间商品id列表
* */
export function liveGoodsIdList({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveGoodsIds',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  设置直播间商品
* */
export function liveGoodsIdSet({ activityId, liveId, goodsIdList }) {
  return request({
    url: '/pcadmin/addLiveGoods',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播间id
      goods_ids: goodsIdList // 直播间商品ids [数组]
    }
  })
}

/*
*  获取直播间敏感词
* */
export function liveWordList({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getSensitiveWordsList',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId // 直播间id
    }
  })
}

/*
*  设置直播间敏感词
* */
export function liveWordSet({ activityId, liveId, wordList }) {
  return request({
    url: '/pcadmin/updateSensitiveWords',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播间id
      words: wordList // 敏感词数组 [数组]
    }
  })
}

/*
*  获取直播章数据
* */
export function liveMedalData({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveBadgeList',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  设置直播章
* */
export function liveMedalSet({ activityId, liveId, openStatus, brandList }) {
  return request({
    url: '/pcadmin/openOrCloseLiveBadge',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播间id
      is_open: openStatus, // 状态: 1-开启 0-关闭
      badge_list: brandList // 直播章品牌列表
    }
  })
}

/*
*  新增直播素材
* */
export function liveMaterialAdd({ activityId, idList }) {
  return request({
    url: '​/pcadmin/addLiveMaterial',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      live_material: idList // 直播素材数组
    }
  })
}

/*
*  更新直播素材
* */
export function liveMaterialEdit({ activityId, id, content }) {
  return request({
    url: '​/pcadmin/updateLiveMaterial',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      id, // 素材id
      content // 直播素材内容
    }
  })
}

/*
*  删除直播素材
* */
export function liveMaterialDelete({ activityId, idList }) {
  return request({
    url: '​/pcadmin/deleteLiveMaterial',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      ids: idList // 素材ids 数组
    }
  })
}

/*
*  获取直播间商品列表
* */
export function liveGoodsList({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveGoodsList',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  获取直播间消息列表
* */
export function liveMessageList({ index, size, activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveMessageList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  获取直播间数据
* */
export function liveInfoData({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveRoomIndexData',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  发红包
* */
export function redPackageSend({ activityId, liveId, typeIndex, money, num, area, timeStatus, sendTime, note }) {
  return request({
    url: '/pcadmin/sendRedPacket',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播室id
      money, // 红包金额
      num, // 红包个数
      type: typeIndex, // 红包类型: 0-普通红包 1-拼手气红包
      province: area[0], // 领取区域 省 code
      city: area[1], // 领取区域 市 code
      is_timing: timeStatus, // 是否定时 0否 1是
      set_time: sendTime, // 发送时间 Y-m-d
      note // 备注
    }
  })
}

/*
* 获取直播公告列表
* */
export function noticeList({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveAnnouncementList',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  新增直播公告
* */
export function noticeAdd({ activityId, liveId, content }) {
  return request({
    url: '/pcadmin/addLiveAnnouncement',
    method: 'post',
    data: {
      activity_id: activityId,
      live_id: liveId,
      content
    }
  })
}

/*
*  编辑直播公告
* */
export function noticeEdit({ activityId, liveId, id, content }) {
  return request({
    url: '/pcadmin/updateLiveAnnouncement',
    method: 'post',
    data: {
      activity_id: activityId,
      live_id: liveId,
      id, // 公告id
      content
    }
  })
}

/*
*  删除直播公告
* */
export function noticeDelete({ activityId, liveId, id }) {
  return request({
    url: '/pcadmin/deleteLiveAnnouncement',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId,
      id // 公告id
    }
  })
}

/*
*  获取直播间订单列表
* */
export function liveOrderList({ index, size, activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveOrderList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      activity_id: activityId,
      live_id: liveId
    }
  })
}

/*
*  获取直播主播列表
* */
export function liveAnchorList({ activityId, liveId }) {
  return request({
    url: '/pcadmin/getLiveAnchorList',
    method: 'get',
    params: {
      activity_id: activityId,
      live_id: liveId
    }
  })
}

