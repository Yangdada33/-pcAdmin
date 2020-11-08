import request from '@/utils/request'

/*
* 获取规则模板类型列表
* */
export function ruleTypeList() {
  return request({
    url: '/pcadmin/getRuleTemplateType',
    method: 'get'
  })
}

/*
*  获取规则模板列表
* */
export function ruleTemplateList({ index, size, type, sponsorId }) {
  return request({
    url: '/pcadmin/getRuleTemplateListByType',
    method: 'get',
    params: {
      page: index,
      limit: size,
      type,
      hoster_id: sponsorId
    }
  })
}

/*
*  获取规则模板详情
* */
export function ruleTemplateDetail(id) {
  return request({
    url: '/pcadmin/getRuleTemplateById',
    method: 'get',
    params: {
      id
    }
  })
}

/*
*  新增规则模板
* */
export function ruleTemplateAdd({ type, content }) {
  return request({
    url: '/pcadmin/addRuleTemplate',
    method: 'post',
    data: {
      type,
      content
    }
  })
}

/*
*  修改规则模板
* */
export function ruleTemplateEdit({ id, type, content }) {
  return request({
    url: '/pcadmin/updateRuleTemplate',
    method: 'post',
    data: {
      id,
      type,
      content
    }
  })
}

/*
*  删除规则模板
* */
export function ruleTemplateDelete(id) {
  return request({
    url: '/pcadmin/deleteRuleTemplate',
    method: 'get',
    params: {
      id
    }
  })
}
