export const imageSuffixList = ['png', 'jpg', 'jpeg', 'gif']
export const videoSuffixList = ['mp4', 'avi', 'flv']
export const audioSuffixList = ['mp3']

export const projectUrl = 'https://api3.feimi0513.xyz'
export const templateUrl = projectUrl + '/file/'
export const loginScanFilter = projectUrl + '/pcadmin/#/loginScanFilter'
export const wechatRelateFilter = projectUrl + '/pcadmin/#/relate/wechatScanFilter'

export const roleTypeData = ['platform', 'sponsor']

export const activityModuleData = {
  activity_video: { path: 'videoIntroduce', icon: require('@/assets/section/section_video.png') },
  activity_hot_sell: { path: 'hotGoods', icon: require('@/assets/section/section_hot.png') },
  activity_special_sell: { path: 'specialGoods', icon: require('@/assets/section/section_special.png') },
  activity_time_limited_second_kill: { path: 'secondGoods', icon: require('@/assets/section/section_second.png') },
  activity_the_whole_second_kill: { path: 'pointGoods', icon: require('@/assets/section/section_point.png') },
  activity_voucher: { path: 'coupon', icon: require('@/assets/section/section_coupon.png') },
  activity_voucher_group: { path: 'couponPackage', icon: require('@/assets/section/section_coupon_package.png') },
  activity_detail: { path: 'activityDetail', icon: require('@/assets/section/section_activity_detail.png') },
  activity_point_rank: { path: 'rankingGift', icon: require('@/assets/section/section_ranking.png') },
  activity_point_exchange: { path: 'exchangeGift', icon: require('@/assets/section/section_exchange.png') },
  activity_lottery_draw: { path: 'activityPrize', icon: require('@/assets/section/section_prize.png') },
  activity_gift: { path: 'freeGift', icon: require('@/assets/section/section_free.png') },
  activity_adv: { path: 'banner', icon: require('@/assets/section/section_banner.png') },
  activity_shopping_gift: { path: 'shopGift', icon: require('@/assets/section/section_shop.png') }
}

export const goodsTypeData = {
  hot: 3, // 爆款商品
  special: 5, // 特价商品
  live: 4, // 直播商品
  second: 2, // 限时秒杀商品
  point: 1 // 整点秒杀商品
}

export const materialTypeData = {
  note: 0, // 短信素材
  live: 1, // 直播素材
  music: 2 // 音乐素材
}

export const ruleTypeData = {
  money: 0, // 金币规则
  score: 1, // 积分规则
  shopGift: 2, // 逛店章礼品领取规则
  coupon: 3, // 现金券规则
  couponPackage: 4, // 现金券活动规则
  rankingGift: 5, // 积分礼品规则（排行）
  exchangeGift: 6, // 积分礼品规则（兑换）
  prize: 7, // 抽奖规则
  freeGift: 8, // 免费领好礼规则
  liveBenefit: 9, // 福利发放规则（直播）
  liveGift: 10 // 直播章礼品领取规则
}

export const rechargeTypeData = {
  note: 10, // 短信
  spread: 11, // 推广费用
  prize: 12, // 奖金账户
  live: 13 // 直播账户
}

export const adminTypeData = {
  activity: 6, // 活动管理员
  super: 7 // 超级管理员
}

export const positionList = ['员工', '主管', '品牌负责人', '执行人']
