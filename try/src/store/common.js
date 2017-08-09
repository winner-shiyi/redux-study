import '../util/fix'
import { message, notification, Icon } from 'antd'
import React from 'react'
import fetch from '../util/fetch'
import { browserHistory } from 'react-router'
const CryptoJS = require('../util/crypto-js')
// ------------------------------------
// Constants
// ------------------------------------
export const SHOW_MESSAGE = 'SHOW_MESSAGE'
export const MENU_REQUEST = 'MENU_REQUEST'
export const MENU_SUCCESS = 'MENU_SUCCESS'
export const MENU_FAILURE = 'MENU_FAILURE'
export const MENU_OPEN = 'MENU_OPEN'
export const SHOW_EDITPWD = 'SHOW_EDITPWD'
export const HIDE_EDITPWD = 'HIDE_EDITPWD'
export const SAVE_PWD_REQUEST = 'SAVE_PWD_REQUEST'
export const SAVE_PWD_SUCCESS = 'SAVE_PWD_SUCCESS'
export const SAVE_PWD_FAILURE = 'SAVE_PWD_FAILURE'
export const CLICK_TOP_MENU = 'CLICK_TOP_MENU'
export const CLICK_SUB_MENU = 'CLICK_SUB_MENU'
export const CLICK_MENU_ITEM = 'CLICK_MENU_ITEM'
export const INITIAL_MENU = 'INITIAL_MENU'
export const INIT_COMMON = 'INIT_COMMON'
export const INIT_COMPANY = 'INIT_COMPANY'
export const INIT_COMPANY_REQUEST = 'INIT_COMPANY_REQUEST'
export const INIT_COMPANY_SUCCESS = 'INIT_COMPANY_SUCCESS'
export const INIT_COMPANY_FAILURE = 'INIT_COMPANY_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
function showMessage (msg, type = 'info') {
  return {
    type: SHOW_MESSAGE,
    payload: {
      msg: msg,
      type: type
    }
  }
}

function menuRequest () {
  return {
    type: MENU_REQUEST,
  }
}

function menuSuccess (data) {
  return {
    type: MENU_SUCCESS,
    payload: data
  }
}

function menuFailure (msg) {
  return {
    type: MENU_FAILURE,
    payload: msg,
  }
}

function menuOpen (openKeys) {
  return {
    type: MENU_OPEN,
    payload: openKeys,
  }
}

function menuLoad () {
  return dispatch => {
    dispatch(menuRequest())
    return fetch('//localhost:8090/mock/menu.json', {}, {
      method: 'GET',
    })
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(menuSuccess(json))
          if (location.pathname === '/Manage') {
            const firstLink = json.resultData.find((item) => {
              return !!item.href
            })
            firstLink && browserHistory.replace(firstLink.href)
          }
          dispatch(initialMenu())
          return json
        }
      })
  }
}

function showEditPwd () {
  return {
    type: SHOW_EDITPWD,
  }
}

function hideEditPwd () {
  return {
    type: HIDE_EDITPWD,
  }
}

const savePwdRequest = (params) => {
  return {
    type: SAVE_PWD_REQUEST,
    payload: params,
  }
}

const savePwdSuccess = (data) => {
  return {
    type: SAVE_PWD_SUCCESS,
    payload: data,
  }
}

const savePwdFailure = (msg) => {
  return {
    type: SAVE_PWD_FAILURE,
    payload: msg,
  }
}

const key = CryptoJS.enc.Latin1.parse('eGluZ3Vhbmd4Yw==')
const iv = CryptoJS.enc.Latin1.parse('voskplutwrfnnpuk')

const savePwd = (params) => {
  return dispatch => {
    let oldPassword = CryptoJS.AES.encrypt(
      params.oldPassword,
      key,
      {
        iv:iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      })
    let newPassword = CryptoJS.AES.encrypt(
      params.newPassword,
      key,
      {
        iv:iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.ZeroPadding,
      })
    params.oldPassword = oldPassword.toString()
    params.newPassword = newPassword.toString()
    dispatch(savePwdRequest(params))
    return fetch('/modifyPWD', params)
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(savePwdSuccess(json.resultData))
          return true
        } else {
          dispatch(savePwdFailure(json.resultDesc))
        }
      })
  }
}

const clickTopMenu = (id) => {
  return {
    type: CLICK_TOP_MENU,
    payload: id,
  }
}

const clickMenuItem = (id) => {
  return {
    type: CLICK_MENU_ITEM,
    payload: id,
  }
}

const clickSubMenu = (id) => {
  return {
    type: CLICK_SUB_MENU,
    payload: id,
  }
}

const initialMenu = () => {
  return {
    type: INITIAL_MENU,
    payload: location.pathname,
  }
}

const initCommon = () => {
  return {
    type: INIT_COMMON,
  }
}

const companyRequest = (params) => {
  return {
    type: INIT_COMPANY_REQUEST,
    payload: params,
  }
}

const companySuccess = (data) => {
  return {
    type: INIT_COMPANY_SUCCESS,
    payload: data,
  }
}

const companyFailure = (msg) => {
  return {
    type: INIT_COMPANY_FAILURE,
    payload: msg,
  }
}

const initCompany = (params) => {
  return dispatch => {
    dispatch(companyRequest(params))
    return fetch('/org/findByUser', params)
      .then(json => {
        if (json.resultCode === '0000') {
          dispatch(companySuccess(json.resultData))
          return true
        } else {
          dispatch(companyFailure(json.resultDesc))
        }
      })
  }
}

export const common = {
  showMessage,
  menuLoad,
  menuOpen,
  showEditPwd,
  hideEditPwd,
  savePwd,
  clickTopMenu,
  clickMenuItem,
  clickSubMenu,
  initialMenu,
  initCommon,
  initCompany,
}

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [SHOW_MESSAGE]: (state, action) => {
    let newState = Object.assign({}, state)
    message[action.payload.type](action.payload.msg)
    return newState
  },
  [MENU_REQUEST]: (state, action) => {
    return {
      ...state,
      pageLoading: true
    }
  },
  [MENU_SUCCESS]: (state, action) => {

    let topMenuData = []
    let secondMenuData = []
    let leafMenuData = []
    let lastMenuData = []

    action.payload.resultData.forEach((item) => {
      if (item.parentIds.split(',').length === 3) {
        topMenuData.push(item)
      } else if (item.parentIds.split(',').length === 4) {
        secondMenuData.push(item)
      } else if (item.parentIds.split(',').length === 5 && item.isShow == '1') {
        leafMenuData.push(item)
      } else if (item.parentIds.split(',').length === 6) {
        lastMenuData.push(item)
      }
    })

    // organize leaf and last
    let tempList = []
    let leftList = lastMenuData
    let leafRealData = []
    let permission = {}
    leafMenuData.forEach((item) => {
      item.children = []
      permission[item.id] = {}
      leftList.forEach((subItem) => {
        if (subItem.parentId === item.id) {
          item.children.push(subItem)
          let operator = subItem.permission.replace(/(.*)\:/, '')
          if (operator === 'read') {
            leafRealData.push(item)
          }
          permission[item.id][operator] = true
        } else {
          tempList.push(subItem)
        }
      })
      leftList = tempList
      tempList = []
    })

    return {
      ...state,
      pageLoading: false,
      menuData: action.payload.resultData,
      topMenuData,
      secondMenuData,
      leafMenuData: leafRealData,
      lastMenuData,
      permission,
    }
  },
  [MENU_FAILURE]: (state, action) => {
    message.error(action.payload.message)
    return {
      ...state,
      pageLoading: false
    }
  },
  [MENU_OPEN]: (state, action) => {
    return {
      ...state,
      openKeys: action.payload
    }
  },
  [SHOW_EDITPWD]: (state, action) => {
    return {
      ...state,
      editPwdVisible: true,
    }
  },
  [HIDE_EDITPWD]: (state, action) => {
    return {
      ...state,
      editPwdVisible: false,
    }
  },
  [SAVE_PWD_REQUEST]: (state, action) => {
    return {
      ...state,
      savePwdLoading: true,
    }
  },
  [SAVE_PWD_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      savePwdLoading: false,
      editPwdVisible: false,
    }
  },
  [SAVE_PWD_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      savePwdLoading: false,
    }
  },
  [CLICK_TOP_MENU]: (state, action) => {
    let secondMenuData = state.secondMenuData.filter((item) => {
      return item.parentId === action.payload
    })

    let firstLeaf = secondMenuData.length > 0 && state.leafMenuData.find((item) => {
      return item.parentId === secondMenuData[0].id
    })

    return {
      ...state,
      savePwdLoading: false,
      selectedTopKeys: [action.payload],
      sideMenuData: [secondMenuData, state.leafMenuData],
      firstLeaf: firstLeaf,
    }
  },
  [CLICK_SUB_MENU]: (state, action) => {
    const index = state.openedKeys.indexOf(action.payload)
    index > -1 ? state.openedKeys.splice(index, 1) : state.openedKeys.push(action.payload)
    return {
      ...state,
      openedKeys: state.openedKeys,
    }
  },
  [CLICK_MENU_ITEM]: (state, action) => {
    sessionStorage.setItem('menuTree', JSON.stringify([state.selectedTopKeys[0], state.openedKeys, action.payload]))
    return {
      ...state,
      selectedKeys: [action.payload],
    }
  },
  [INITIAL_MENU]: (state, action) => {
    let menuTree
    // const firstNodes = state.menuData && state.menuData.childList || []
    // for (let i = 0, fLen = firstNodes.length; i < fLen; i++) {
    //   let secondNodes = firstNodes[i].childList
    //   for (let j = 0, sLen = secondNodes.length; j < sLen; j++) {
    //     let thirdNodes = secondNodes[j].childList
    //     for (let k = 0, tLen = thirdNodes.length; k < tLen; k++) {
    //       if (thirdNodes[k].href === action.payload) {
    //         menuTree = [firstNodes[i], secondNodes[j], thirdNodes[k]]
    //         // break
    //       }
    //       leafMenuData.push(thirdNodes[k])
    //     }
    //   }
    // }

    for (let i = 0, len = state.leafMenuData.length; i < len; i++) {
      let leafMenu = state.leafMenuData[i]
      if (leafMenu.href === action.payload) {
        let sp = leafMenu.parentIds.split(',')
        menuTree = [sp[2], Array.from(new Set([...state.openedKeys || [], sp[3]])), leafMenu.id]
        menuTree && sessionStorage.setItem('menuTree', JSON.stringify(menuTree))
      }
    }

    let sk = {
      selectedTopKeys: [],
      openedKeys: [],
      selectedKeys: [],
    }

    if (!menuTree) {
      menuTree = JSON.parse(sessionStorage.getItem('menuTree'))
    }

    if (menuTree) {
      sk = {
        selectedTopKeys: [menuTree[0]],
        openedKeys: menuTree[1],
        selectedKeys: [menuTree[2]],
      }
    }

    return {
      ...state,
      ...sk,
      sideMenuData: [(state.secondMenuData || []).filter((item) => {
        return item.parentId === (menuTree ? menuTree[0] : '')
      }), state.leafMenuData],
    }
  },
  [INIT_COMMON]: (state, action) => {
    const user = JSON.parse(sessionStorage.getItem('user'))

    // detect browser version
    const userAgent = (navigator.userAgent.match(/Chrome\/(\d+)\./) || [])[1] || 0;
    userAgent && (+userAgent < 54) && notification['warning']({
      duration: null,
      message: '浏览器版本过低',
      description: <div>请下载<a href="http://www.chromeliulanqi.com/Chrome_Latest_Setup.exe">最新版chrome浏览器</a></div>,
    })
    return {
      ...state,
      editPwdVisible: user && user.firstLogin || false,
    }
  },
  [INIT_COMPANY_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [INIT_COMPANY_SUCCESS]: (state, action) => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    user.companyId = action.payload.id
    user.companyType = action.payload.type
    sessionStorage.setItem('user', JSON.stringify(user))
    return {
      ...state,
    }
  },
  [INIT_COMPANY_FAILURE]: (state, action) => {
    // message.error(action.payload)
    return {
      ...state,
    }
  },
}

const user = JSON.parse(sessionStorage.getItem('user'))

const initialState = {
  menuData: [],
  topMenuData: [],
  sideMenuData: [[], []],
  leafMenuData: [],
  editPwdVisible: user && user.firstLogin || false,
  savePwdLoading: false,
  permission: {},
  selectedKeys: [],
}
export default function commonReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
