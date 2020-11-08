import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import LayoutSub from '@/layout/indexSub'

const activityManageBeforeEnter = (to, from, next) => {
  const { activityData, moduleList } = store.state.activity
  if (activityData.id || moduleList.length === 1) {
    next()
  } else {
    next(to.matched[0].path || '/dataView/index')
  }
}

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set

    activeSubMenu  ''            if set path, the sidebarSub will highlight the path you set
    subStatus: true              if set true, this show the current menu is in sidebarSub menu(default is false)
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },

  {
    path: '/loginScanFilter',
    component: () => import('@/views/login/LoginScanFilter.vue'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/admin',
    component: Layout,
    hidden: true,
    redirect: '/admin/super',
    meta: { title: '管理员', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'super',
        component: () => import('@/views/system/admin/super/index.vue'),
        name: 'AdminSuper',
        meta: { title: '超级管理员' }
      },
      {
        path: 'super/add',
        component: () => import('@/views/system/admin/super/superAdd.vue'),
        name: 'SuperAdd',
        meta: { title: '新增管理员' }
      }
    ]
  },

  {
    path: '/relate',
    component: Layout,
    hidden: true,
    redirect: '/relate/wechat',
    meta: { title: '关联', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'wechat',
        component: () => import('@/views/system/relate/wechat/index.vue'),
        name: 'RelateWechat',
        meta: { title: '关联微信' }
      },
      {
        path: 'wechatScanFilter',
        component: () => import('@/views/system/relate/wechat/WechatScanFilter.vue'),
        name: 'WechatScanFilter'
      }
    ]
  },

  {
    path: '/meal',
    component: Layout,
    hidden: true,
    redirect: '/meal/info',
    meta: { title: '套餐', roles: ['sponsor'] },
    children: [
      {
        path: 'info',
        component: () => import('@/views/system/meal/info/index.vue'),
        name: 'MealInfo',
        meta: { title: '套餐情况' }
      }
    ]
  },

  {
    path: '/password',
    component: Layout,
    hidden: true,
    redirect: '/password/reset',
    meta: { title: '密码', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'reset',
        component: () => import('@/views/system/password/reset/index.vue'),
        name: 'PasswordReset',
        meta: { title: '修改密码' }
      }
    ]
  },

  {
    path: '/phone',
    component: Layout,
    hidden: true,
    redirect: '/phone/reset',
    meta: { title: '手机号', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'reset',
        component: () => import('@/views/system/phone/reset/index.vue'),
        name: 'PhoneReset',
        meta: { title: '修改手机号' }
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dataView/index',
    meta: { title: '数据总览', icon: 'el-icon-collection', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'dataView/index',
        component: () => import('@/views/dataView/index.vue'),
        name: 'DataView',
        meta: { title: '数据总览', icon: 'el-icon-collection' }
      }
    ]
  },

  {
    path: '/sponsorList',
    component: Layout,
    redirect: '/sponsorList/index',
    meta: { title: '主办方列表', icon: 'el-icon-s-custom', roles: ['platform'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/sponsorList/index.vue'),
        name: 'SponsorList',
        meta: { title: '主办方列表', icon: 'el-icon-s-custom' }
      },
      {
        path: 'previewData',
        component: () => import('@/views/sponsorList/previewData/index.vue'),
        hidden: true,
        name: 'PreviewData',
        meta: { title: '查看总览', activeMenu: '/sponsorList/index' },
        props: (route) => ({ sponsorId: route.query.id, sponsorName: route.query.name })
      },
      {
        path: 'previewActivity',
        component: () => import('@/views/sponsorList/previewActivity/index.vue'),
        hidden: true,
        name: 'PreviewActivity',
        meta: { title: '查看活动', activeMenu: '/sponsorList/index' },
        props: (route) => ({ sponsorId: route.query.id, sponsorName: route.query.name })
      }
    ]
  },

  {
    path: '/activityManage',
    component: Layout,
    redirect: '/activityManage/index',
    meta: { title: '活动管理', icon: 'el-icon-s-flag', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/activityManage/index.vue'),
        name: 'ActivityManage',
        meta: { title: '活动管理', icon: 'el-icon-s-flag' }
      },
      {
        path: 'baseSet',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/baseSet/templateSelect',
        name: 'BaseSet',
        meta: { title: '基础设置', icon: 'activity_base_set', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'templateSelect',
            component: () => import('@/views/activityManage/baseSet/templateSelect/index.vue'),
            name: 'TemplateSelect',
            meta: { title: '选模板', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'templatePreview',
                component: () => import('@/views/activityManage/baseSet/templateSelect/templatePreview/index.vue'),
                name: 'TemplatePreview',
                meta: {
                  title: '模板预览',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/baseSet/templateSelect',
                  subStatus: false
                }
              }
            ]
          },
          {
            path: 'contentSet',
            component: () => import('@/views/activityManage/baseSet/contentSet/index.vue'),
            name: 'ContentSet',
            meta: { title: '内容设置', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'departmentManage',
            component: () => import('@/views/activityManage/baseSet/departmentManage/index.vue'),
            name: 'DepartmentManage',
            meta: { title: '组织架构', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'brandSet',
                component: () => import('@/views/activityManage/baseSet/departmentManage/brandSet/index.vue'),
                name: 'BrandSet',
                meta: {
                  title: '设置品牌',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/baseSet/departmentManage',
                  subStatus: false
                },
                props: (route) => route.query
              },
              {
                path: 'shopSet',
                component: () => import('@/views/activityManage/baseSet/departmentManage/shopSet/index.vue'),
                name: 'ShopSet',
                meta: {
                  title: '设置门店',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/baseSet/departmentManage',
                  subStatus: false
                },
                props: (route) => route.query
              },
              {
                path: 'personManage',
                component: () => import('@/views/activityManage/baseSet/departmentManage/personManage/index.vue'),
                name: 'PersonManage',
                meta: {
                  title: '员工管理',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/baseSet/departmentManage',
                  subStatus: false,
                  headerData: {
                    type: 'back',
                    title: '组织架构'
                  }
                },
                props: (route) => route.query,
                children: [
                  {
                    path: 'personSet',
                    component: () => import('@/views/activityManage/baseSet/departmentManage/personManage/personSet/index.vue'),
                    name: 'PersonSet',
                    meta: {
                      title: '设置员工',
                      activeMenu: '/activityManage/index',
                      activeSubMenu: '/activityManage/baseSet/departmentManage',
                      subStatus: false
                    },
                    props: (route) => route.query
                  }
                ]
              }
            ]
          },
          {
            path: 'prizeSet',
            component: () => import('@/views/activityManage/baseSet/prizeSet/index.vue'),
            name: 'PrizeSet',
            meta: { title: '奖励设置', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'marketModuleSelect',
            component: () => import('@/views/activityManage/baseSet/marketModuleSelect/index.vue'),
            name: 'MarketModuleSelect',
            meta: { title: '营销模块选择', activeMenu: '/activityManage/index', subStatus: true }
          }
        ]
      },
      {
        path: 'marketModuleSet',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/marketModuleSet/videoIntroduce',
        name: 'MarketModuleSet',
        meta: { title: '营销模块设置', icon: 'activity_market_module_set', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'videoIntroduce',
            component: () => import('@/views/activityManage/marketModuleSet/videoIntroduce/index.vue'),
            name: 'VideoIntroduce',
            meta: { title: '视频介绍', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'hotGoods',
            component: () => import('@/views/activityManage/marketModuleSet/hotGoods/index.vue'),
            name: 'HotGoods',
            meta: { title: '爆款抢购', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'goodsSet',
                component: () => import('@/views/activityManage/marketModuleSet/hotGoods/goodsSet/index.vue'),
                name: 'HotGoodsSet',
                meta: {
                  title: '设置爆款商品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/hotGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsId: route.query.id })
              }
            ]
          },
          {
            path: 'specialGoods',
            component: () => import('@/views/activityManage/marketModuleSet/specialGoods/index.vue'),
            name: 'SpecialGoods',
            meta: { title: '特价抢购', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'goodsSet',
                component: () => import('@/views/activityManage/marketModuleSet/specialGoods/goodsSet/index.vue'),
                name: 'SpecialGoodsSet',
                meta: {
                  title: '设置特价商品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/specialGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsId: route.query.id })
              }
            ]
          },
          {
            path: 'secondGoods',
            component: () => import('@/views/activityManage/marketModuleSet/secondGoods/index.vue'),
            name: 'SecondGoods',
            meta: { title: '限时秒杀', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'goodsSet',
                component: () => import('@/views/activityManage/marketModuleSet/secondGoods/goodsSet/index.vue'),
                name: 'SecondGoodsSet',
                meta: {
                  title: '设置秒杀商品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/secondGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsId: route.query.id })
              },
              {
                path: 'timeSet',
                component: () => import('@/views/activityManage/marketModuleSet/secondGoods/timeSet/index.vue'),
                name: 'SecondTimeSet',
                meta: {
                  title: '设置秒杀时间',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/secondGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsTimeId: route.query.id })
              }
            ]
          },
          {
            path: 'pointGoods',
            component: () => import('@/views/activityManage/marketModuleSet/pointGoods/index.vue'),
            name: 'PointGoods',
            meta: { title: '整点秒杀', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'goodsSet',
                component: () => import('@/views/activityManage/marketModuleSet/pointGoods/goodsSet/index.vue'),
                name: 'PointGoodsSet',
                meta: {
                  title: '设置整点商品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/pointGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsId: route.query.id })
              },
              {
                path: 'timeSet',
                component: () => import('@/views/activityManage/marketModuleSet/pointGoods/timeSet/index.vue'),
                name: 'PointTimeSet',
                meta: {
                  title: '设置整点时间',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/pointGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsTimeId: route.query.id })
              }
            ]
          },
          {
            path: 'coupon',
            component: () => import('@/views/activityManage/marketModuleSet/coupon/index.vue'),
            name: 'Coupon',
            meta: { title: '抢现金券', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'couponSet',
                component: () => import('@/views/activityManage/marketModuleSet/coupon/couponSet/index.vue'),
                name: 'CouponSet',
                meta: {
                  title: '设置现金券',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/coupon',
                  subStatus: false
                },
                props: (route) => ({ couponId: route.query.id })
              }
            ]
          },
          {
            path: 'couponPackage',
            component: () => import('@/views/activityManage/marketModuleSet/couponPackage/index.vue'),
            name: 'CouponPackage',
            meta: { title: '现金券礼包', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'couponPackageSet',
                component: () => import('@/views/activityManage/marketModuleSet/couponPackage/couponPackageSet/index.vue'),
                name: 'CouponPackageSet',
                meta: {
                  title: '设置礼包现金券',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/couponPackage',
                  subStatus: false
                },
                props: (route) => ({ couponId: route.query.id })
              }
            ]
          },
          {
            path: 'activityDetail',
            component: () => import('@/views/activityManage/marketModuleSet/activityDetail/index.vue'),
            name: 'ActivityDetail',
            meta: { title: '活动详情', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'rankingGift',
            component: () => import('@/views/activityManage/marketModuleSet/rankingGift/index.vue'),
            name: 'RankingGift',
            meta: { title: '积分礼品(排名)', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'giftSet',
                component: () => import('@/views/activityManage/marketModuleSet/rankingGift/giftSet/index.vue'),
                name: 'RankingGiftSet',
                meta: {
                  title: '设置积分排名礼品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/rankingGift',
                  subStatus: false
                },
                props: (route) => ({ giftId: route.query.id })
              }
            ]
          },
          {
            path: 'exchangeGift',
            component: () => import('@/views/activityManage/marketModuleSet/exchangeGift/index.vue'),
            name: 'ExchangeGift',
            meta: { title: '积分礼品(兑换)', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'giftSet',
                component: () => import('@/views/activityManage/marketModuleSet/exchangeGift/giftSet/index.vue'),
                name: 'ExchangeGiftSet',
                meta: {
                  title: '设置积分兑换礼品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/exchangeGift',
                  subStatus: false
                },
                props: (route) => ({ giftId: route.query.id })
              }
            ]
          },
          {
            path: 'activityPrize',
            component: () => import('@/views/activityManage/marketModuleSet/activityPrize/index.vue'),
            name: 'ActivityPrize',
            meta: { title: '活动抽奖', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'activityPrizeSet',
                component: () => import('@/views/activityManage/marketModuleSet/activityPrize/prizeSet/index.vue'),
                name: 'ActivityPrizeSet',
                meta: {
                  title: '设置抽奖礼品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/marketModuleSet/activityPrize',
                  subStatus: false
                },
                props: (route) => ({ giftId: route.query.id })
              }
            ]
          },
          {
            path: 'freeGift',
            component: () => import('@/views/activityManage/marketModuleSet/freeGift/index.vue'),
            name: 'FreeGift',
            meta: { title: '免费领好礼', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'banner',
            component: () => import('@/views/activityManage/marketModuleSet/banner/index.vue'),
            name: 'Banner',
            meta: { title: '广告图', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'shopGift',
            component: () => import('@/views/activityManage/marketModuleSet/shopGift/index.vue'),
            name: 'ShopGift',
            meta: { title: '逛店章礼品', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'bannerLocation',
            component: () => import('@/views/activityManage/marketModuleSet/bannerLocation/index.vue'),
            name: 'BannerLocation',
            meta: { title: '广告图位置', activeMenu: '/activityManage/index', subStatus: true }
          }
        ]
      },
      {
        path: 'liveSet',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/liveSet/anchorSet',
        name: 'LiveSet',
        meta: { title: '直播设置', icon: 'activity_live_set', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'anchorSet',
            component: () => import('@/views/activityManage/liveSet/anchorSet/index.vue'),
            name: 'AnchorSet',
            meta: { title: '主播设置', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'liveGoods',
            component: () => import('@/views/activityManage/liveSet/liveGoods/index.vue'),
            name: 'LiveGoods',
            meta: { title: '直播间商品', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'goodsSet',
                component: () => import('@/views/activityManage/liveSet/liveGoods/goodsSet/index.vue'),
                name: 'LiveGoodsSet',
                meta: {
                  title: '设置直播商品',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/liveSet/liveGoods',
                  subStatus: false
                },
                props: (route) => ({ goodsId: route.query.id })
              }
            ]
          },
          {
            path: 'liveList',
            component: () => import('@/views/activityManage/liveSet/liveList/index.vue'),
            name: 'LiveList',
            meta: { title: '直播间列表', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'liveSet',
                component: () => import('@/views/activityManage/liveSet/liveList/liveSet/index.vue'),
                name: 'LiveListSet',
                meta: {
                  title: '设置直播',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/liveSet/liveList',
                  subStatus: false,
                  headerData: {
                    type: 'back',
                    title: '直播间列表'
                  }
                },
                props: (route) => ({ liveId: route.query.id })
              },
              {
                path: 'liveHome',
                component: () => import('@/views/activityManage/liveSet/liveList/liveHome/index.vue'),
                name: 'LiveHome',
                meta: {
                  title: '直播间',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/liveSet/liveList',
                  subStatus: false,
                  headerData: {
                    type: 'back',
                    title: '直播间列表'
                  }
                },
                props: (route) => ({ liveId: route.query.id })
              }
            ]
          }
        ]
      },
      {
        path: 'employeeManage',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/employeeManage/stepSet',
        name: 'EmployeeManage',
        meta: { title: '员工管理', icon: 'activity_employee_manage', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'stepSet',
            component: () => import('@/views/activityManage/employeeManage/stepSet/index.vue'),
            name: 'StepSet',
            meta: { title: '阶段设置', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'taskList',
            component: () => import('@/views/activityManage/employeeManage/taskList/index.vue'),
            name: 'TaskList',
            meta: { title: '任务列表', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'taskSet',
                component: () => import('@/views/activityManage/employeeManage/taskList/taskSet/index.vue'),
                name: 'TaskSet',
                meta: {
                  title: '任务设置',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/employeeManage/taskList',
                  subStatus: false
                },
                props: (route) => ({ taskId: route.query.id })
              }
            ]
          },
          {
            path: 'pkList',
            component: () => import('@/views/activityManage/employeeManage/pkList/index.vue'),
            name: 'PkList',
            meta: { title: 'PK列表', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'pkSet',
                component: () => import('@/views/activityManage/employeeManage/pkList/pkSet/index.vue'),
                name: 'PkSet',
                meta: {
                  title: 'PK设置',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/employeeManage/pkList',
                  subStatus: false
                },
                props: (route) => ({ pkId: route.query.id })
              }
            ]
          },
          {
            path: 'challengeList',
            component: () => import('@/views/activityManage/employeeManage/challengeList/index.vue'),
            name: 'ChallengeList',
            meta: { title: '挑战列表', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'challengeSet',
                component: () => import('@/views/activityManage/employeeManage/challengeList/challengeSet/index.vue'),
                name: 'ChallengeSet',
                meta: {
                  title: '挑战设置',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/employeeManage/challengeList',
                  subStatus: false
                },
                props: (route) => ({ challengeId: route.query.id })
              }
            ]
          }
        ]
      },
      {
        path: 'reviewManage',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/reviewManage/materialReview',
        name: 'ReviewManage',
        meta: { title: '审核管理', icon: 'activity_review_manage', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'materialReview',
            component: () => import('@/views/activityManage/reviewManage/materialReview/index.vue'),
            name: 'MaterialReview',
            meta: { title: '素材库审核', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'employeeReview',
            component: () => import('@/views/activityManage/reviewManage/employeeReview/index.vue'),
            name: 'EmployeeReview',
            meta: { title: '员工注册审核', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'drawReview',
            component: () => import('@/views/activityManage/reviewManage/drawReview/index.vue'),
            name: 'DrawReview',
            meta: { title: '提现审核', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'challengeReview',
            component: () => import('@/views/activityManage/reviewManage/challengeReview/index.vue'),
            name: 'ChallengeReview',
            meta: { title: '挑战审核', activeMenu: '/activityManage/index', subStatus: true }
          }
        ]
      },
      {
        path: 'financeManage',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/financeManage/orderStatistics',
        name: 'FinanceManage',
        meta: { title: '财务管理', icon: 'activity_finance_manage', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'orderStatistics',
            component: () => import('@/views/activityManage/financeManage/orderStatistics/index.vue'),
            name: 'OrderStatistics',
            meta: { title: '财务统计', activeMenu: '/activityManage/index', subStatus: true },
            children: [
              {
                path: 'rechargeSet',
                component: () => import('@/views/activityManage/financeManage/orderStatistics/rechargeSet/index.vue'),
                name: 'RechargeSet',
                meta: {
                  title: '充值设置',
                  activeMenu: '/activityManage/index',
                  activeSubMenu: '/activityManage/financeManage/orderStatistics',
                  subStatus: false
                }
              }
            ]
          },
          {
            path: 'orderList',
            component: () => import('@/views/activityManage/financeManage/orderList/index.vue'),
            name: 'OrderList',
            meta: { title: '交易明细', activeMenu: '/activityManage/index', subStatus: true }
          }
        ]
      },
      {
        path: 'noteManage',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/noteManage/noteList',
        name: 'NoteManage',
        meta: { title: '短信管理', icon: 'activity_note_manage', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'noteList',
            component: () => import('@/views/activityManage/noteManage/noteList/index.vue'),
            name: 'NoteList',
            meta: { title: '短信列表', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'noteSend',
            component: () => import('@/views/activityManage/noteManage/noteSend/index.vue'),
            name: 'NoteSend',
            meta: { title: '发送短信', activeMenu: '/activityManage/index', subStatus: true }
          }
        ]
      },
      {
        path: 'dataExport',
        component: LayoutSub,
        beforeEnter: activityManageBeforeEnter,
        hidden: true,
        redirect: '/activityManage/dataExport/dataPreview',
        name: 'DataExport',
        meta: { title: '数据导出', icon: 'activity_data_export', activeMenu: '/activityManage/index' },
        children: [
          {
            path: 'dataPreview',
            component: () => import('@/views/activityManage/dataExport/dataPreview/index.vue'),
            name: 'DataPreview',
            meta: { title: '数据总览', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'userSign',
            component: () => import('@/views/activityManage/dataExport/userSign/index.vue'),
            name: 'UserSign',
            meta: { title: '用户报名', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'userCoupon',
            component: () => import('@/views/activityManage/dataExport/userCoupon/index.vue'),
            name: 'UserCoupon',
            meta: { title: '购现金券客户', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'hotTimeOrder',
            component: () => import('@/views/activityManage/dataExport/hotTimeOrder/index.vue'),
            name: 'HotTimeOrder',
            meta: { title: '爆款秒杀订单', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'liveOrder',
            component: () => import('@/views/activityManage/dataExport/liveOrder/index.vue'),
            name: 'LiveOrder',
            meta: { title: '直播订单', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'signOrder',
            component: () => import('@/views/activityManage/dataExport/signOrder/index.vue'),
            name: 'SignOrder',
            meta: { title: '签单明细', activeMenu: '/activityManage/index', subStatus: true }
          },
          // {
          //   path: 'noteOrder',
          //   component: () => import('@/views/activityManage/dataExport/noteOrder/index.vue'),
          //   name: 'NoteOrder',
          //   meta: { title: '短信明细', activeMenu: '/activityManage/index', subStatus: true }
          // },
          {
            path: 'payOrder',
            component: () => import('@/views/activityManage/dataExport/payOrder/index.vue'),
            name: 'payOrder',
            meta: { title: '活动收支明细', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'rankingOrder',
            component: () => import('@/views/activityManage/dataExport/rankingOrder/index.vue'),
            name: 'RankingOrder',
            meta: { title: '积分排名明细', activeMenu: '/activityManage/index', subStatus: true }
          },
          {
            path: 'exchangeOrder',
            component: () => import('@/views/activityManage/dataExport/exchangeOrder/index.vue'),
            name: 'ExchangeOrder',
            meta: { title: '奖金池兑换明细', activeMenu: '/activityManage/index', subStatus: true }
          }
        ]
      }
    ]
  },

  {
    path: '/platformSet',
    component: Layout,
    redirect: '/platformSet/mealList',
    meta: { title: '平台设置', icon: 'el-icon-s-tools', roles: ['platform'] },
    children: [
      {
        path: 'mealList',
        component: () => import('@/views/platformSet/mealList/index.vue'),
        name: 'MealList',
        meta: { title: '套餐列表' },
        children: [
          {
            path: 'mealSet',
            component: () => import('@/views/platformSet/mealList/mealSet/index.vue'),
            hidden: true,
            name: 'MealSet',
            meta: {
              title: '设置套餐',
              activeMenu: '/platformSet/mealList'
            },
            props: (route) => ({ mealId: route.query.id })
          }
        ]
      },
      {
        path: 'livePay',
        component: () => import('@/views/platformSet/livePay/index.vue'),
        name: 'LivePay',
        meta: { title: '直播流量预付款' }
      },
      {
        path: 'platformDept',
        component: () => import('@/views/platformSet/platformDept/index.vue'),
        name: 'PlatformDept',
        meta: { title: '组织架构' }
      },
      {
        path: 'material',
        component: () => import('@/views/platformSet/material/index.vue'),
        name: 'Material',
        meta: { title: '素材库' }
      },
      {
        path: 'ruleTemplate',
        component: () => import('@/views/platformSet/ruleTemplate/index.vue'),
        name: 'RuleTemplate',
        meta: { title: '规则模板' }
      },
      {
        path: 'DrawReview',
        component: () => import('@/views/platformSet/drawReview/index.vue'),
        name: 'PlatformDrawReview',
        meta: { title: '提现审核' }
      },
      {
        path: 'expenseSet',
        component: () => import('@/views/platformSet/expenseSet/index.vue'),
        name: 'ExpenseSet',
        meta: { title: '费用设置' }
      }
    ]
  },

  {
    path: '/templateManage',
    component: Layout,
    alwaysShow: true,
    redirect: '/templateManage/materialList',
    meta: { title: '模板管理', icon: 'el-icon-s-claim', roles: ['sponsor'] },
    children: [
      {
        path: 'materialList',
        component: () => import('@/views/templateManage/materialList/index.vue'),
        name: 'MaterialList',
        meta: { title: '素材库' }
      },
      {
        path: 'ruleList',
        component: () => import('@/views/templateManage/ruleList/index.vue'),
        name: 'RuleList',
        meta: { title: '规则库' }
      }
    ]
  },

  {
    path: '/liveFlow',
    component: Layout,
    alwaysShow: true,
    redirect: '/liveFlow/rechargeList',
    meta: { title: '直播流量', icon: 'el-icon-video-camera-solid', roles: ['sponsor'] },
    children: [
      {
        path: 'rechargeList',
        component: () => import('@/views/liveFlow/rechargeList/index.vue'),
        name: 'RechargeList',
        meta: { title: '充值明细' }
      }
    ]
  },

  {
    path: '/inviteReview',
    component: Layout,
    alwaysShow: true,
    redirect: '/inviteReview/superAdmin',
    name: 'InviteReview',
    meta: { title: '邀请审核', icon: 'el-icon-s-check', roles: ['platform', 'sponsor'] },
    children: [
      {
        path: 'superAdmin',
        name: 'SuperAdmin',
        component: () => import('@/views/inviteReview/superAdmin/index.vue'),
        meta: { title: '超级管理员审核' }
      },
      {
        path: 'activityAdmin',
        name: 'ActivityAdmin',
        component: () => import('@/views/inviteReview/activityAdmin/index.vue'),
        meta: { title: '活动管理员审核' }
      },
      {
        path: 'liverAdmin',
        name: 'LiverAdmin',
        component: () => import('@/views/inviteReview/liverAdmin/index.vue'),
        meta: { title: '主播审核' }
      }
    ]
  },

  {
    path: '/cooperate',
    component: Layout,
    alwaysShow: true,
    redirect: '/cooperate/record',
    name: 'Cooperate',
    meta: { title: '软件合作', icon: 'el-icon-s-cooperation', roles: ['platform'] },
    children: [
      {
        path: 'record',
        name: 'CooperateRecord',
        component: () => import('@/views/cooperate/record/index.vue'),
        meta: { title: '客户留言记录' }
      }
      // {
      //   path: 'advise',
      //   name: 'CooperateAdvise',
      //   component: () => import('@/views/cooperate/advise/index.vue'),
      //   meta: { title: '意见反馈' }
      // }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

/**
 * params参数值类型
 *    String 直接跳转目标地址
 *    Object
 *      targetUrl: 目标地址
 *      moduleList: 二级菜单显示模块
 *      type: 跳转类型
 *      backStatus: 返回
 *      backStep: 返回层级
 * */
export function navigatePath(params) {
  if (typeof params === 'string') {
    router.push(params)
  } else if (typeof params === 'object' && JSON.stringify(params).indexOf('{') === 0) {
    const { targetUrl, moduleList, type, backStatus, backStep } = params
    moduleList && moduleList.length && store.commit('activity/setModuleList', moduleList)
    if (!backStatus) {
      router[type || 'push'](targetUrl)
    } else {
      backStep ? router.go(-backStep) : router.back()
    }
  }
}

export const activityAddModuleList = [{ path: 'baseSet', children: ['templateSelect'] }]
export const activitySetModuleList = [{ path: 'baseSet' }, { path: 'employeeManage' }]
export const activitySetModuleListWidthLive = [{ path: 'baseSet' }, { path: 'liveSet' }, { path: 'employeeManage' }]
export const reviewManageModuleList = [{ path: 'reviewManage' }]
export const financeManageModuleList = [{ path: 'financeManage' }]
export const noteManageModuleList = [{ path: 'noteManage' }]
export const dataExportModuleList = [{ path: 'dataExport' }]

export default router
