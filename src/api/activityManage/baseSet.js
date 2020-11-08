import request from '@/utils/request'

/*
*  获取活动基础设置详情
* */
export function activityBaseDetail(activityId) {
  return request({
    url: '/pcadmin/getActivityBaseSetting',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  获取模板列表
* */
export function activityTemplateList() {
  return request({
    url: '/pcadmin/getActivityTemplateList',
    method: 'get'
  })
}

/*
*  新增活动基础
* */
export function activityBaseAdd(params) {
  return request({
    url: '/pcadmin/addActivityBaseSetting',
    method: 'post',
    data: {
      style_id: params.style_id, // 主题id
      theme_id: params.theme_id, // 模板id
      activity_type: params.activity_type, // 活动类型：0-单品牌版 1-联盟版 2-工厂版
      is_live: params.is_live, // 直播：0-关闭 1-直播
      name: params.name, // 活动标题
      start_time: params.start_time, // 活动开始时间
      end_time: params.end_time, // 活动结束时间
      is_area_limit: params.is_area_limit, // 地区限制：0-不限 1-限制
      area_limit: params.area_limit, // 活动地区（地区-隔开 多个地区,隔开）
      main_image: params.main_image, // 主图图片
      is_open_music: params.is_open_music, // 音乐：0-关闭 1-开启
      bgm: params.bgm, // 背景音乐
      is_open_barrage: params.is_open_barrage, // 弹幕：0-关闭 1-开启
      is_open_notice: params.is_open_notice, // 公告: 0-关闭 1-开启
      notice: params.notice,
      mobile: params.mobile, // 客服电话
      qrcode: params.qrcode, // 群二维码
      poster: params.poster, // 推广海报
      copywrite: params.copywrite, // 海报描述
      goods_limit: params.goods_limit, // 商品限购
      goods_limit_remark: params.goods_limit_remark, // 限购说明
      signids: params.signids, // 审核人id列表
      share_title: params.share_title, // 分享标题
      share_desc: params.share_desc, // 分享描述
      share_image: params.share_image // 分享图片
    }
  })
}

/*
*  修改活动基础
* */
export function activityBaseEdit(params) {
  console.log(params)
  return request({
    url: '/pcadmin/updateActivityBaseSetting',
    method: 'post',
    data: {
      activity_id: params.activity_id,
      style_id: params.style_id, // 主题id
      theme_id: params.theme_id, // 模板id
      activity_type: params.activity_type, // 活动类型：0-单品牌版 1-联盟版 2-工厂版
      is_live: params.is_live, // 直播：0-关闭 1-直播
      name: params.name, // 活动标题
      start_time: params.start_time, // 活动开始时间
      end_time: params.end_time, // 活动结束时间
      is_area_limit: params.is_area_limit, // 地区限制：0-不限 1-限制
      area_limit: params.area_limit, // 活动地区（地区-隔开 多个地区,隔开）
      main_image: params.main_image, // 主图图片
      is_open_music: params.is_open_music, // 音乐：0-关闭 1-开启
      bgm: params.bgm, // 背景音乐
      is_open_barrage: params.is_open_barrage, // 弹幕：0-关闭 1-开启
      is_open_notice: params.is_open_notice, // 公告: 0-关闭 1-开启
      notice: params.notice,
      mobile: params.mobile, // 客服电话
      qrcode: params.qrcode, // 群二维码
      poster: params.poster, // 推广海报
      copywrite: params.copywrite, // 海报描述
      goods_limit: params.goods_limit, // 商品限购
      goods_limit_remark: params.goods_limit_remark, // 限购说明
      signids: params.signids, // 审核人id列表
      share_title: params.share_title, // 分享标题
      share_desc: params.share_desc, // 分享描述
      share_image: params.share_image // 分享图片
    }
  })
}

/*
*  组织架构导入
* */
export function departmentLeadIn({ file, activityId }) {
  const formData = new FormData() // 构造一个 FormData，把后台需要发送的参数添加
  formData.append('file', file) // 接口需要传的参数
  formData.append('activity_id', activityId) // 活动id
  return request({
    url: '/pcadmin/excelImportStructure',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    data: formData
  })
}

/*
*  获取组织架构列表
* */
export function departmentList({ index, size, activityId }) {
  return request({
    url: '/pcadmin/getStructureList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      activity_id: activityId
    }
  })
}

/*
*  获取组织架构详情(品牌/门店)
* */
export function departmentDetail({ activityId, departmentId }) {
  return request({
    url: '/pcadmin/getStructureById',
    method: 'get',
    params: {
      activity_id: activityId,
      id: departmentId
    }
  })
}

/*
*  新增组织架构
* */
export function departmentAdd({ activityId, type, name, logo, manager, address, mobile, brand, longitude, latitude, sort }) {
  return request({
    url: '/pcadmin/addStructure',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      type, // 类型1品牌2门店
      name, // 品牌/门店名称(1,2 必须)
      logo, // 品牌logo(1 必须)
      charge_uid: manager, // 负责人id(1,2 必须)
      address, // 地址(2 必须)
      mobile, // 联系方式(2 必须)
      pid: brand, // 品牌id(2 必须)
      lnt: longitude, // 经度(2 必须)
      lat: latitude, // 纬度(2 必须)
      sort// 排序
    }
  })
}

/*
*  修改组织架构
* */
export function departmentEdit({ id, activityId, type, name, logo, manager, address, mobile, brand, longitude, latitude, sort }) {
  return request({
    url: '/pcadmin/updateStructure',
    method: 'post',
    data: {
      id,
      activity_id: activityId, // 活动id
      type, // 类型1品牌2门店
      name, // 品牌/门店名称(1,2 必须)
      logo, // 品牌logo(1 必须)
      charge_uid: manager, // 负责人id(1,2 必须)
      address, // 地址(2 必须)
      mobile, // 联系方式(2 必须)
      pid: brand, // 品牌id(2 必须)
      lnt: longitude, // 经度(2 必须)
      lat: latitude, // 纬度(2 必须)
      sort// 排序
    }
  })
}

/*
*  获取品牌列表(门店)
* */
export function brandShopList(activityId) {
  return request({
    url: '/pcadmin/getStructureSelect',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  获取所有员工列表
* */
export function employeeListWithActivity(activityId) {
  return request({
    url: '/pcadmin/getUserAdminList',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
* 获取员工列表
* */
export function employeeList({ index, size, activityId, shopId, pageStatus = true }) {
  return request({
    url: '/pcadmin/getStaffList',
    method: 'get',
    params: {
      page: index,
      limit: size,
      activity_id: activityId,
      cat_id: shopId, // 门店id
      is_page: pageStatus // 分页状态：true-分页 false-不分页
    }
  })
}

/*
*  新增员工
* */
export function employeeAdd({ activityId, brand, shop, name, position, mobile }) {
  return request({
    url: '/pcadmin/addStaff',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      brand_id: brand, // 品牌id
      cat_id: shop, // 门店id
      name, // 员工姓名
      type: position, // 职位
      mobile // 员工电话
    }
  })
}

/*
*  修改员工
* */
export function employeeEdit({ id, activityId, brand, shop, name, position, mobile }) {
  return request({
    url: '/pcadmin/updateStaff',
    method: 'post',
    data: {
      id,
      activity_id: activityId, // 活动id
      brand_id: brand, // 品牌id
      cat_id: shop, // 门店id
      name, // 员工姓名
      type: position, // 职位
      mobile // 员工电话
    }
  })
}

/*
*  批量删除员工
* */
export function employeeDelete({ activityId, idList }) {
  return request({
    url: '/pcadmin/deleteStaff',
    method: 'post',
    data: {
      activity_id: activityId,
      ids: idList
    }
  })
}

/*
*  获取活动奖励数据
* */
export function prizeDetail(activityId) {
  return request({
    url: '/pcadmin/getRewardSetting',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  设置活动奖励
* */
export function prizeSet(params) {
  return request({
    url: '/pcadmin/setRewardSetting',
    method: 'post',
    data: {
      activity_id: params.activity_id, // 活动id
      point_view: params.point_view, // 有效浏览积分
      point_fission: params.point_fission, // 裂变积分
      point_share: params.point_share, // 分享积分
      point_sign: params.point_sign, // 报名积分
      point_buy_card: params.point_buy_card, // 购卡积分
      point_order: params.point_order, // 下单积分
      point_live: params.point_live, // 进直播间积分
      point_live_order: params.point_live_order, // 直播间下单积分
      share_limit: params.share_limit, // 当日分享积分上限
      view_redpacket_max: params.view_redpacket_max, // 浏览红包上限
      view_redpacket_min: params.view_redpacket_min, // 浏览红包下限
      fission_redpacket_max: params.fission_redpacket_max, // 裂变红包上限
      fission_redpacket_min: params.fission_redpacket_min, // 裂变红包下限
      fission_redpacket_num: params.fission_redpacket_num, // 裂变奖励红包人次
      reward_rule: params.reward_rule // 奖励规则
    }
  })
}

/*
*  获取活动模块列表
* */
export function moduleList(activityId) {
  return request({
    url: '/pcadmin/getMarketingModuleList',
    method: 'get',
    params: {
      activity_id: activityId
    }
  })
}

/*
*  设置活动模块
* */
export function moduleSet({ activityId, moduleList }) {
  return request({
    url: '/pcadmin/setActivityMarketingModule',
    method: 'post',
    data: {
      activity_id: activityId,
      module_array: moduleList
    }
  })
}
