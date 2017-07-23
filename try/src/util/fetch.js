import fetch from 'isomorphic-fetch'
import { message } from 'antd'
import { getBaseUrl } from '../util'

const decorateParams = (params = {}) => { // compatible with the param like "foo: {value: 'xxx', ...}"
  let res = {}
  for (let i in params) {
    let param = params[i] // TODO
    let value = typeof param === 'object' && // fields is a object perhaps
    !(param instanceof Array) && // not array
    !(param._d) // not moment
      ? (param.value && param.value.trim && param.value.trim() || param.value) : param

    if (value instanceof Array && value.length === 2) { // dateRange, datetimeRange, numberRange
      if (param.type === 'datetimeRange' || param.type === 'numberRange') {
        res[i + 'Start'] = value[0] || undefined
        res[i + 'End'] = value[1] || undefined
      } else if (param.type === 'dateRange') {
        res[i + 'Start'] = value[0].format('YYYY-MM-DD 00:00:00')
        res[i + 'End'] = value[1].format('YYYY-MM-DD 23:59:59')
      } else {
        res[i] = value
      }
    } else {
      if (/^\d{4}\-\d{2}\-\d{2}\s\d{2}:\d{2}$/.test(value)) { // fix time string to second
        value = value + ':00'
      }
      res[i] = typeof value === 'undefined' ? '' : (value && value.trim && value.trim() || value)
    }
  }
  return res
}

export default (url, params = {}, opts = {}) => {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + sessionStorage.getItem('accessToken'),
    },
  }

  opts = {
    ...defaultOpts,
    ...opts,
  }

  if (opts.method === 'POST') {
    opts.body = JSON.stringify(decorateParams(params))
  }
  document.querySelector('#overlay').style.display = 'block'
  return fetch(url.indexOf('//') > -1 ? url : (getBaseUrl() + url), opts)
    .then(res => {
      document.querySelector('#overlay').style.display = 'none'
      if (res.status < 200 || res.status >= 300) {
        return {
          resultCode: '-1',
          resultDesc: res.status + ' ' + res.statusText,
        }
      }
      const contentType = res.headers.get('content-type')
      if (contentType.indexOf('application/json') > -1) {
        return res.json()
      } else {
        return res.blob()
      }
    })
    .then(json => {
      if (json.type) { // blob
        return json
      }
      if (json.resultCode === '0004' || json.resultCode === '0002') { // 登录过期或未登录
        sessionStorage.setItem('accessToken', '')
        sessionStorage.setItem('user', '{}')
        location.assign('/SignIn')
      }
      return json
    })
    .catch(e => {
      document.querySelector('#overlay').style.display = 'none'
      return {
        resultCode: '-1',
        resultDesc: '网络异常，请重试',
      }
    })
}
