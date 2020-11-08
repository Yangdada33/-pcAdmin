import request from '@/utils/request'

/*
*  充值设置
* */
export function rechargeSet({ activityId, liveId, money, type }) {
  return request({
    url: '/pcadmin/accountRecharge',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      live_id: liveId, // 直播id
      amount: money, // 充值金额
      type // 充值账户类型: 10-短信 11-推广费用 12-奖金账户 13-直播账户
    }
  })
}

/*
*  获取订单支付状态
* */
export function rechargeOrderData({ activityId, orderSn }) {
  return request({
    url: '/pcadmin/checkOrderStatus',
    method: 'get',
    params: {
      activity_id: activityId,
      order_sn: orderSn
    }
  })
}

/*
*  获取品牌列表
* */
export function brandList(activityId) {
  return request({
    url: '/pcadmin/brandList',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  获取规则
*     规则类型
*       point_lotto_rule 积分抽奖规则
*       voucher_rule 现金券规则
*       point_goods_rule 积分礼品规则
*       point_shop_rule 积分商城规则
*       free_gift_rule 免费领好礼规则
*       shopbadge_rule 逛店章规则
*       livebadge_rule 直播章规则
* */
export function ruleData({ activityId, ruleType }) {
  return request({
    url: '/pcadmin/ruleInfo',
    method: 'post',
    data: {
      activity_id: activityId,
      rule_type: ruleType
    }
  })
}

/*
*  设置规则
* */
export function ruleSet({ activityId, ruleType, ruleCont }) {
  return request({
    url: '/pcadmin/updateRule',
    method: 'post',
    data: {
      activity_id: activityId,
      rule_type: ruleType,
      content: ruleCont
    }
  })
}

/*
*  获取活动视频
* */
export function videoDetail(activityId) {
  return request({
    url: '/pcadmin/activityVideoInfo',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置活动视频
* */
export function videoSet({ videoId, activityId }) {
  return request({
    url: '/pcadmin/saveActivityVideo',
    method: 'post',
    data: {
      video_url: videoId,
      activity_id: activityId
    }
  })
}

/*
*  获取商品列表
* */
export function goodsList({ index, size, activityId, type, goodsName, brandId }) {
  return request({
    url: '/pcadmin/activityGoodsList',
    method: 'post',
    data: {
      page: index,
      limit: size,
      activity_id: activityId,
      type, // 商品类型: 5-特价 4-直播商品 3-爆款 2-限时 1-整点
      goods_name: goodsName,
      brand_id: brandId
    }
  })
}

/*
*  获取商品详情
* */
export function goodsDetail({ activityId, goodsId }) {
  return request({
    url: '/pcadmin/activityGoodsInfo',
    method: 'post',
    data: {
      activity_id: activityId,
      goods_id: goodsId
    }
  })
}

/*
*  设置商品(新增/修改)
* */
export function goodsSet(params) {
  return request({
    url: '/pcadmin/saveActivityGoods',
    method: 'post',
    data: {
      type: params.type, // 商品类型：5-特价 4-直播商品 3-爆款 2-限时 1-整点
      activity_id: params.activityId,	// 活动id
      goods_id: params.id, // 商品id
      brand_id: params.brand,	// 品牌id
      goods_name: params.name, // 商品名称
      goods_image: params.picture.id, //	商品图片
      sku: params.standards, // 商品规格
      des: params.desCont, // 商品描述
      old_price: params.originalPrice, //	原价
      present_price: params.activityPrice, // 活动价(特价)
      ms_price: params.typePrice, // 爆款价/特价/限时价/整点价
      front_money: params.payPrice, // 预付款
      commission: params.income, // 佣金
      storage: params.storage, //	库存
      is_booster: params.helpStatus, // 是否需要助力: 0-不需要 1-需要
      booster_num: params.helpNum, // 助力人数
      sort: params.sort, //	排序
      status: params.saleStatus // 上架状态
    }
  })
}

/*
*  上架/下架商品
* */
export function goodsSale({ goodsId, type = 1 }) {
  return request({
    url: '/pcadmin/shelfGoods',
    method: 'post',
    data: {
      goods_id: goodsId,
      action: type // 状态 0 下架 1上架  默认1
    }
  })
}

/*
*  删除商品
* */
export function goodsDelete({ activityId, goodsId }) {
  return request({
    url: '/pcadmin/deleteActivityGoods',
    method: 'post',
    data: {
      goods_id: goodsId,
      activity_id: activityId
    }
  })
}

/*
*  获取秒杀列表(限时/整点)
* */
export function goodsTimeList({ activityId, timeType }) {
  return request({
    url: '/pcadmin/activityHotSellList',
    method: 'post',
    data: {
      activity_id: activityId,
      sell_type: timeType // 秒杀类型 1整点秒杀 2限时秒杀
    }
  })
}

/*
*  获取秒杀商品列表(限时/整点-不带分页)
* */
export function goodsTimeListWidthNoPage({ activityId, timeType }) {
  return request({
    url: '/pcadmin/goodsList',
    method: 'post',
    data: {
      activity_id: activityId,
      type: timeType // 秒杀类型 1整点秒杀 2限时秒杀
    }
  })
}

/*
*  设置秒杀(限时/整点)
* */
export function goodsTimeSet({ activityId, timeType, goodsTimeId, startTime, endTime, keepHour, goodsIdList }) {
  return request({
    url: '/pcadmin/saveHotSell',
    method: 'post',
    data: {
      activity_id: activityId, //	关联活动id
      sell_type: timeType, // 商品类型 3特价抢购 2限时秒杀 1整点秒杀
      id: goodsTimeId, //	主键id
      start_time: startTime, //	开始时间
      end_time: endTime, //	结束时间
      keep: keepHour,
      goods_arr: goodsIdList // 关联的商品id列表
    }
  })
}

/*
*  删除秒杀(限时/整点)
* */
export function goodsTimeDelete(goodsTimeId) {
  return request({
    url: '/pcadmin/deleteHotSell',
    method: 'post',
    data: {
      id: goodsTimeId
    }
  })
}

/*
*  获取活动详情图
* */
export function detailData(activityId) {
  return request({
    url: '/pcadmin/activityDetailList',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置活动详情图
* */
export function detailSet({ activityId, idList }) {
  return request({
    url: '/pcadmin/addActivityDetail',
    method: 'post',
    data: {
      activity_id: activityId,
      img: idList
    }
  })
}

/*
*  获取优惠券列表
* */
export function couponList(activityId, type = 0) {
  return request({
    url: '/pcadmin/voucherList',
    method: 'post',
    data: {
      activity_id: activityId,
      type // 类型: 0-现金券 1-现金券礼包
    }
  })
}

/*
*  获取优惠券详情
* */
export function couponDetail({ activityId, couponId }) {
  return request({
    url: '/pcadmin/voucherInfo',
    method: 'post',
    data: {
      activity_id: activityId,
      voucher_id: couponId
    }
  })
}

/*
*  新增优惠券
* */
export function couponAdd({ activityId, brand, equalPrice, limitPrice, purchasePrice, storage, purchaseNum, useCondition, sort, redPackage }) {
  return request({
    url: '/pcadmin/addVoucher',
    method: 'post',
    data: {
      activity_id: activityId,	// 关联活动id
      cat_id: brand, // 品牌id
      price: equalPrice, // 面值
      price_limit: limitPrice, // 限用金额
      sell_price: purchasePrice, // 销售价格
      num: storage, // 库存
      user_limit: purchaseNum,
      des: useCondition, // 描述
      sort, // 排序
      commission: redPackage // 购卡红包奖励
    }
  })
}

/*
*  修改优惠券
* */
export function couponEdit({ activityId, id, brand, equalPrice, limitPrice, purchasePrice, storage, purchaseNum, useCondition, sort, redPackage }) {
  return request({
    url: '/pcadmin/editVoucher',
    method: 'post',
    data: {
      activity_id: activityId,	// 关联活动id
      voucher_id: id, // 优惠券id
      cat_id: brand, // 品牌id
      price: equalPrice, // 面值
      price_limit: limitPrice, // 限用金额
      sell_price: purchasePrice, // 销售价格
      num: storage, // 库存
      user_limit: purchaseNum,
      des: useCondition, // 描述
      sort, // 排序
      commission: redPackage // 购卡红包奖励
    }
  })
}

/*
*  删除优惠券
* */
export function couponDelete({ activityId, couponId }) {
  return request({
    url: '/pcadmin/deleteVoucher',
    method: 'post',
    data: {
      activity_id: activityId,
      voucher_id: couponId
    }
  })
}

/*
*  获取优惠券礼包数据
* */
export function couponPackageData(activityId) {
  return request({
    url: '/pcadmin/voucherBagInfo',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置优惠券礼包
* */
export function couponPackageSet({ activityId, id, storage, price, redPackage, ruleCont }) {
  return request({
    url: '/pcadmin/voucherBag',
    method: 'post',
    data: {
      activity_id: activityId, // 活动id
      id, // 礼包主键id
      storage, // 库存
      price, // 价格
      commission: redPackage, // 佣金
      voucher_rule: ruleCont // 规则
    }
  })
}

/*
*  设置礼包现金券
* */
export function couponPackageCouponSet({ activityId, id, brand, equalPrice, limitPrice, useCondition, sort }) {
  return request({
    url: '/pcadmin/saveVoucher',
    method: 'post',
    data: {
      activity_id: activityId, // 关联活动id
      id,	// 现金券主键id
      cat_id: brand, // 现金券所属品牌
      price: equalPrice, // 现金券面值
      price_limit: limitPrice, // 限用金额
      des: useCondition, // 现金券描述
      sort // 现金券排序
    }
  })
}

/*
*  获取积分排名礼品列表
* */
export function rankingGiftList({ index, size, activityId }) {
  return request({
    url: '/pcadmin/pointGoodsRewardList',
    method: 'post',
    data: {
      page: index,
      limit: size,
      activity_id: activityId
    }
  })
}

/*
*  新增积分排名礼品
* */
export function rankingGiftAdd({ activityId, name, picture, rangeNum, amount }) {
  return request({
    url: '/pcadmin/addPointGoodsReward',
    method: 'post',
    data: {
      activity_id: activityId, // 关联活动id
      name: rangeNum,	// 名次
      goods_name: name, // 礼品名称
      image: picture.id, // 商品图片资源id
      storage: amount // 商品数量
    }
  })
}

/*
*  修改积分排名礼品
* */
export function rankingGiftEdit({ activityId, id, name, picture, rangeNum, amount }) {
  return request({
    url: '/pcadmin/editPointGoodsReward',
    method: 'post',
    data: {
      activity_id: activityId, // 关联活动id
      goods_id: id, // 商品id
      name: rangeNum,	// 名次
      goods_name: name, // 礼品名称
      image: picture.id, // 商品图片资源id
      storage: amount // 商品数量
    }
  })
}

/*
*  删除积分排名礼品
* */
export function rankingGiftDelete({ activityId, giftId }) {
  return request({
    url: '/pcadmin/deletePointGoodsReward',
    method: 'post',
    data: {
      activity_id: activityId, // 关联活动id
      goods_id: giftId // 商品id
    }
  })
}

/*
*  获取积分兑换/抽奖礼品列表
* */
export function exchangeAndPrizeGiftList({ index, size, activityId, giftType }) {
  return request({
    url: '/pcadmin/pointGoodsList',
    method: 'post',
    data: {
      page: index,
      limit: size,
      activity_id: activityId,
      type: giftType // 商品类型: 0-兑换 1-抽奖
    }
  })
}

/*
*  获取积分兑换/抽奖礼品详情
* */
export function exchangeAndPrizeGiftDetail({ activityId, giftId }) {
  return request({
    url: '/pcadmin/pointGoodsInfo',
    method: 'post',
    data: {
      activity_id: activityId,
      goods_id: giftId
    }
  })
}

/*
*  新增积分兑换/抽奖礼品
* */
export function exchangeAndPrizeGiftAdd(params) {
  return request({
    url: '/pcadmin/addPointGoods',
    method: 'post',
    data: {
      activity_id: params.activityId, // 关联活动id
      goods_name: params.name, // 礼品名称
      img: params.picture.id, // 商品图片
      price: params.purchasePrice, // 支付现金
      point: params.exchangeScore, // 兑换积分
      storage: params.amount, // 商品库存
      sort: params.sort, // 排序
      goods_limit: params.exchangeNum, // 每人限兑
      content: params.desCont, // 商品描述
      type: params.giftType // 商品类型: 0-兑换 1-抽奖
    }
  })
}

/*
*  修改积分兑换/抽奖礼品
* */
export function exchangeAndPrizeGiftEdit(params) {
  return request({
    url: '/pcadmin/editPointGoods',
    method: 'post',
    data: {
      activity_id: params.activityId, // 关联活动id
      goods_id: params.id, // 商品id
      goods_name: params.name, // 礼品名称
      img: params.picture.id, // 商品图片
      price: params.purchasePrice, // 支付现金
      point: params.exchangeScore, // 兑换积分
      storage: params.amount, // 商品库存
      sort: params.sort, // 排序
      goods_limit: params.exchangeNum, // 每人限兑
      content: params.desCont, // 商品描述
      type: params.giftType // 商品类型: 0-兑换 1-抽奖
    }
  })
}

/*
*  删除积分兑换/抽奖礼品
* */
export function exchangeAndPrizeGiftDelete({ activityId, giftId }) {
  return request({
    url: '/pcadmin/deletePointGoods',
    method: 'post',
    data: {
      activity_id: activityId, // 关联活动id
      goods_id: giftId // 商品id
    }
  })
}

/*
*  获取积分抽奖数据
* */
export function prizeData(activityId) {
  return request({
    url: '/pcadmin/pointGoodsModuleInfo',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置积分抽奖数据
* */
export function prizeSet({ activityId, id, scoreNum, prizeNum, ruleCont, probability }) {
  return request({
    url: '/pcadmin/savePointGoodsModule',
    method: 'post',
    data: {
      activity_id: activityId, // 关联活动id
      id, // 主键id
      num: scoreNum, // 抽奖积分
      times_limit: prizeNum, // 单日抽奖上线
      des: ruleCont, // 积分抽奖规则描述
      probability: probability / 100 // 中奖概率
    }
  })
}

/*
*  获取奖品中奖概率
* */
export function prizePropPreview(activityId) {
  return request({
    url: '/pcadmin/previewPointGoodsModule',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  获取免费好礼数据
* */
export function freeGiftData(activityId) {
  return request({
    url: '/pcadmin/giftInfo',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置免费好礼
* */
export function freeGiftSet({ activityId, id, name, picture, storage, helpNum, receiveDes, ruleCont }) {
  return request({
    url: '/pcadmin/saveGift',
    method: 'post',
    data: {
      activity_id: activityId,
      id: id, // 主键id
      goods_name: name, //	商品名称
      gift_img: picture.id, // 商品图片
      storage, // 库存
      target: helpNum, // 助力人数
      des: receiveDes, // 说明
      free_gift_rule: ruleCont // 规则
    }
  })
}

/*
*  获取逛店/直播章礼品数据
* */
export function medalGiftData({ activityId, medalType }) {
  return request({
    url: '/pcadmin/shopGiftInfo',
    method: 'post',
    data: {
      activity_id: activityId,
      type: medalType // 类型: 0-逛店章 1-直播章
    }
  })
}

/*
*  设置逛店/直播章礼品
* */
export function medalGiftSet({ activityId, id, name, picture, storage, ruleCont, medalNum, medalType = 0 }) {
  return request({
    url: '/pcadmin/saveShopGift',
    method: 'post',
    data: {
      activity_id: activityId,
      id,
      name,
      img: picture.id,
      storage,
      rule: ruleCont,
      target: medalNum,
      type: medalType
    }
  })
}

/*
*  获取广告图数据
* */
export function bannerData(activityId) {
  return request({
    url: '/pcadmin/advList',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置广告图
* */
export function bannerSet({ activityId, bannerList }) {
  return request({
    url: '/pcadmin/saveAdv',
    method: 'post',
    data: {
      activity_id: activityId,
      req: bannerList
    }
  })
}

/*
*  获取广告位模块数据
* */
export function bannerSectionData(activityId) {
  return request({
    url: '/pcadmin/marketList',
    method: 'post',
    data: {
      activity_id: activityId
    }
  })
}

/*
*  设置广告位模块
* */
export function bannerSectionSet({ activityId, sectionList }) {
  return request({
    url: '/pcadmin/saveAdvSort',
    method: 'post',
    data: {
      activity_id: activityId,
      req: sectionList
    }
  })
}

/*
*  获取模块内广告位列表
* */
export function moduleBannerList({ activityId, type }) {
  return request({
    url: '/pcadmin/moduleAdv',
    method: 'post',
    data: {
      activity_id: activityId,
      type // 模块类型: 5-特价商品 3-爆款 2-限时 1-整点
    }
  })
}

/*
*  保存模块内广告位
* */
export function moduleBannerSet({ activityId, type, moduleList }) {
  return request({
    url: '/pcadmin/saveModuleAdv',
    method: 'post',
    data: {
      activity_id: activityId,
      type,
      imgs: moduleList // 广告位数组，没图片用空占位
    }
  })
}
