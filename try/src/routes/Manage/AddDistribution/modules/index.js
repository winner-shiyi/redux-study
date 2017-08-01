import { message } from 'antd'
import { createAction } from '../../../../util'
import fetch from '../../../../util/fetch'
import addr from '../../../../../public/mock/addr2.json'

// ------------------------------------
// Constants
// ------------------------------------
const TPL_HELLO = 'TPL_HELLO'
const ADDDISTRIBUTION_ADD_RECEIVER_INFO = 'ADDDISTRIBUTION_ADD_RECEIVER_INFO'
const ADDDISTRIBUTION_REDUCE_RECEIVER_INFO = 'ADDDISTRIBUTION_REDUCE_RECEIVER_INFO'
const ADDDISTRIBUTION_RECORD_CHANGE = 'ADDDISTRIBUTION_RECORD_CHANGE'
const ADDDISTRIBUTION_SENDER_MAP_CHANGE = 'ADDDISTRIBUTION_SENDER_MAP_CHANGE'
const ADDDISTRIBUTION_RECEIVER_MAP_CHANGE = 'ADDDISTRIBUTION_RECEIVER_MAP_CHANGE'
const ADDDISTRIBUTION_SUBMIT_REQUEST = 'ADDDISTRIBUTION_SUBMIT_REQUEST'
const ADDDISTRIBUTION_SUBMIT_SUCCESS = 'ADDDISTRIBUTION_SUBMIT_SUCCESS'
const ADDDISTRIBUTION_SUBMIT_FAILURE = 'ADDDISTRIBUTION_SUBMIT_FAILURE'
const ADDDISTRIBUTION_SENDER_SEARCH_REQUEST = 'ADDDISTRIBUTION_SENDER_SEARCH_REQUEST'
const ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS = 'ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS'
const ADDDISTRIBUTION_SENDER_SEARCH_FAILURE = 'ADDDISTRIBUTION_SENDER_SEARCH_FAILURE'
// ------------------------------------
// Actions
// ------------------------------------

const senderSearchRequest = (params) => { 
  return {
    type: 'ADDDISTRIBUTION_SENDER_SEARCH_REQUEST',
    payload: params,
  }
}
const senderSearchSuccess = (data) => {
  return {
    type: 'ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS',
    payload: data,
  }
}

const senderSearchFailure = (msg) => {
  return {
    type: 'ADDDISTRIBUTION_SENDER_SEARCH_FAILURE',
    payload: msg,
  }
}

const senderSearch = (params) => { // 发货商家模糊搜索
  return dispatch => {
    dispatch(senderSearchRequest(params)) // sendInfo.json
    // return fetch('/resetPWD', { shopName: params.shopName }) // todo 等待接口
    fetch('//' + location.host + '/mock/sendInfo.json', params, {
      method: 'GET',
    })
      .then(json => {
        if (json.resultCode === '0000') {
          dispatch(senderSearchSuccess(json.resultData))
          return json.resultData.password
        } else {
          dispatch(senderSearchFailure(json.resultDesc))
        }
      })
  }
}
export const actions = {
  hello: createAction(TPL_HELLO),
  addReceiverInfo: createAction(ADDDISTRIBUTION_ADD_RECEIVER_INFO),
  reduceReceiverInfo: createAction(ADDDISTRIBUTION_REDUCE_RECEIVER_INFO, 'id'),
  changeRecord: createAction(ADDDISTRIBUTION_RECORD_CHANGE, 'fields'),
  changeSenderMap: createAction(ADDDISTRIBUTION_SENDER_MAP_CHANGE, 'mapValue'),
  changeReceiverMap: createAction(ADDDISTRIBUTION_RECEIVER_MAP_CHANGE, 'mapValues'),
  submit: (params) => {
    return {
      types: [ADDDISTRIBUTION_SUBMIT_REQUEST, ADDDISTRIBUTION_SUBMIT_SUCCESS, ADDDISTRIBUTION_SUBMIT_FAILURE],
      callAPI: () => fetch('/repairbill/', params), // todo
    }
  },
  senderSearch,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TPL_HELLO]: (state, action) => {
    message.info(state.helloText)
    let newState = {
      ...state,
    }
    return newState
  },
  /**
   * 增加收货地址
   */
  [ADDDISTRIBUTION_ADD_RECEIVER_INFO]: (state, action) => {
    let numId = state.receiverFormNo
    numId++
    let receiverFields = state.receiverFields
    // let NewreceiverFields = state.receiverFields
    receiverFields.push({
      id: numId,
      fields: [
        {
          'label': '商家名称',
          'name':  numId + 'shopName',
          'required': true,
          'max': 20,
        },
        {
          'label': '联系人',
          'name': numId + 'userName',
          'required': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': numId + 'phone',
          'required': true,
          'phone': true,
        },
        {
          'label': '送达起始时间',
          'name': numId + 'deliveryBeginTime',
          'required': false,
          'type': 'datetime',
        },
        {
          'label': '送达结束时间',
          'name': numId + 'deliveryEndTime',
          'required': false,
          'type': 'datetime',
        },
        {
          'label': '收货地区',
          'required': true,
          'name': numId + 'region',
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
        },
        {
          'label': '详细地址',
          'name': numId + 'addressDetail',
          'required': true,
          'type': 'textarea',
          'max': 50,
          
        },
      ],
    })

    let newState = {
      ...state,
      receiverFormNo:numId,
      receiverFields,
      // NewreceiverFields,
    }
    return newState
  },
  /**
   * 删除收货地址
   */
  [ADDDISTRIBUTION_REDUCE_RECEIVER_INFO]: (state, action) => {
    let newState = Object.assign({}, state)
    let newReceiverFields = [...newState.receiverFields]
    let index = newReceiverFields.findIndex(item => item.id === action.id)
    newReceiverFields.splice(index, 1)
    newState.receiverFields = newReceiverFields
    return newState
  },
  /**
   * 发货商家名称模糊搜索
   */
  [ADDDISTRIBUTION_SENDER_SEARCH_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS]: (state, action) => {
    message.success('搜索成功')
    return {
      ...state,
      newSenderInfos: action.payload.list,
    }
  },
  [ADDDISTRIBUTION_SENDER_SEARCH_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
    }
  },
  /**
   * 提交车配任务表单
   */
  [ADDDISTRIBUTION_SUBMIT_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [ADDDISTRIBUTION_SUBMIT_SUCCESS]: (state, action) => {
    message.success('提交成功')
    return {
      ...state,
      record: {},
    }
  },
  [ADDDISTRIBUTION_SUBMIT_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
    }
  },

  /**
   * 表单数据改变更新
   */
  [ADDDISTRIBUTION_RECORD_CHANGE]: (state, action) => {
    let newState = {
      ...state,
      record: {
        ...state.record,
        ...action.fields,
      },
    }
    return newState
  },
  /**
   * 发货地图信息更新
   */
  [ADDDISTRIBUTION_SENDER_MAP_CHANGE]: (state, action) => {
    let newState = {
      ...state,
      senderMap: {
        ...state.senderMap,
        ...action.mapValue,
      },
    }
    return newState
  },
  /**
   * 收货地图信息更新
   */
  [ADDDISTRIBUTION_RECEIVER_MAP_CHANGE]: (state, action) => {
    let newState = {
      ...state,
      // receiverMap
      
    }
    return newState
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  receiverFormNo: 0,
  receiverFields: [
    {
      id:'0',
      fields:[
        {
          'label': '商家名称',
          'name': '0shopName',
          'required': true,
          'max': 20,
        },
        {
          'label': '联系人',
          'name': '0userName',
          'required': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': '0phone',
          'required': true,
          'phone': true,
        },
        {
          'label': '送达起始时间',
          'name': '0deliveryBeginTime',
          'required': false,
          'type': 'datetime',
        },
        {
          'label': '送达结束时间',
          'name': '0deliveryEndTime',
          'required': false,
          'type': 'datetime',
        },
        {
          'label': '收货地区',
          'required': true,
          'name': '0region',
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
        },
        {
          'label': '详细地址',
          'name': '0addressDetail',
          'required': true,
          'type': 'textarea',
          'max': 50,
        },
      ],
    },
  ],
  record: { // 用来保存填写的表单数据
    region: {
      value: [],
    },
    addressDetail: {
      value: '',
    },
    shopName: {
      value: '',
    },
    userName: {
      value: '',
    },
    phone: {
      value: '',
    },
  }, 
  senderMap: { // 用来保存【发货】高德地图返回的位置信息
    adcode:'',
    latitude:'',
    longitude:'',
  },
  receiverMap: [ // 用来保存【收货】高德地图返回的位置信息
    {
      id:0,
      adcode:'',
      latitude:'',
      longitude:'',
    },
  ],
  newSenderInfos: [], //
  helloText: 'I’m a mother father gentleman',
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
