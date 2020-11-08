/**
 * Created by PanJiaChen on 16/11/18.
 */

import { moneyRegex } from '@/utils/pattern'

const isNumber = require('is-number')

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} mobile
 * @returns {Boolean}
 */
export function validMobile(mobile) {
  return isNumber(mobile) && mobile.length === 11
}

/**
 * @param {object} rule
 * @param {string} value
 * @param {function} callback
 * @returns {Boolean}
 */
export function validateMoney(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入金额'))
  } else if (!moneyRegex.test(value)) {
    callback(new Error('请输入正确格式金额，最多两位小数'))
  } else {
    callback()
  }
}

/**
 * @param {object} rule
 * @param {string} value
 * @param {function} callback
 * @returns {Boolean}
 */
export function validateMoneyWithZero(rule, value, callback) {
  if (!value) {
    callback()
  } else if (!moneyRegex.test(value)) {
    callback(new Error('请输入正确格式金额，最多两位小数'))
  } else {
    callback()
  }
}

/**
 * @param {object} rule
 * @param {string} value
 * @param {function} callback
 * @returns {Boolean}
 */
export function validateIntegerMoney(rule, value, callback) {
  if (value) {
    if (Number.isInteger(Number(value))) {
      callback()
    } else {
      callback(new Error('请输入整数金额'))
    }
  } else {
    callback(new Error('请输入金额'))
  }
}

/**
 * @param {string} url
 * @param {array} suffixList
 * @returns {Boolean}
 */
export function validateSuffix(url, suffixList) {
  const pointIndex = url.lastIndexOf('.')
  const suffixStr = url.substr(pointIndex + 1)
  return suffixList.includes(suffixStr)
}

/**
 * @param {string} str
 * @returns {boolean}
 */
export function validateJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)
      return typeof obj === 'object' && obj
    } catch (e) {
      return false
    }
  }
  return false
}
