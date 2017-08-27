import { message } from 'antd'
import { createAction, createEmptyObject } from '../../../../util'
import fetch from '../../../../util/fetch'
import addr from '../../../../../public/mock/addr2.json'
import { formatDate } from '../../../../util/date'

// ------------------------------------
// Constants
// ------------------------------------
const ADDDISTRIBUTION_REQUEST = 'ADDDISTRIBUTION_REQUEST'
const ADDDISTRIBUTION_SUCCESS = 'ADDDISTRIBUTION_SUCCESS'
const ADDDISTRIBUTION_FAILURE = 'ADDDISTRIBUTION_FAILURE'
const ADDDISTRIBUTION_ADD_RECEIVER_INFO = 'ADDDISTRIBUTION_ADD_RECEIVER_INFO'
const ADDDISTRIBUTION_REDUCE_RECEIVER_INFO = 'ADDDISTRIBUTION_REDUCE_RECEIVER_INFO'
const ADDDISTRIBUTION_RECORD_CHANGE = 'ADDDISTRIBUTION_RECORD_CHANGE'
const ADDDISTRIBUTION_SUBMIT_REQUEST = 'ADDDISTRIBUTION_SUBMIT_REQUEST'
const ADDDISTRIBUTION_SUBMIT_SUCCESS = 'ADDDISTRIBUTION_SUBMIT_SUCCESS'
const ADDDISTRIBUTION_SUBMIT_FAILURE = 'ADDDISTRIBUTION_SUBMIT_FAILURE'
const ADDDISTRIBUTION_SENDER_SEARCH_REQUEST = 'ADDDISTRIBUTION_SENDER_SEARCH_REQUEST'
const ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS = 'ADDDISTRIBUTION_SENDER_SEARCH_SUCCESS'
const ADDDISTRIBUTION_SENDER_SEARCH_FAILURE = 'ADDDISTRIBUTION_SENDER_SEARCH_FAILURE'
const ADDDISTRIBUTION_CLEAR_DATA = 'ADDDISTRIBUTION_CLEAR_DATA' // 清空数据
// ------------------------------------
// Actions
// ------------------------------------

const request = (id) => {
  return {
    type: ADDDISTRIBUTION_REQUEST,
  }
}
const success = (data) => {
  return {
    type: ADDDISTRIBUTION_SUCCESS,
    payload: data,
  }
}
const failure = (msg) => {
  return {
    type: ADDDISTRIBUTION_FAILURE,
    payload: msg,
  }
}

const editOredr = (id) => {
  return dispatch => {
    dispatch(request(id))
    return fetch('/order/edit', { orederNo:id })
      .then(json => {
        if (json.resultCode === '0') {
          dispatch(success(json.resultData))
        } else {
          dispatch(failure(json.resultDesc))
        }
      })
  }
}

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
    dispatch(senderSearchRequest(params)) 
    return fetch('/sender/fuzzyQuery', { shopName: params }) // todo 等待接口
      .then(json => {
        if (json.resultCode === '0') {
          dispatch(senderSearchSuccess(json.resultData))
          return json.resultData.list
        } else {
          dispatch(senderSearchFailure(json.resultDesc))
        }
      })
  }
}
export const actions = {
  addReceiverInfo: createAction(ADDDISTRIBUTION_ADD_RECEIVER_INFO),
  reduceReceiverInfo: createAction(ADDDISTRIBUTION_REDUCE_RECEIVER_INFO, 'id'),
  changeRecord: createAction(ADDDISTRIBUTION_RECORD_CHANGE, 'fields'),
  clearData: createAction(ADDDISTRIBUTION_CLEAR_DATA),
  submit: (params) => {
    console.log('params', params)
    return {
      types: [ADDDISTRIBUTION_SUBMIT_REQUEST, ADDDISTRIBUTION_SUBMIT_SUCCESS, ADDDISTRIBUTION_SUBMIT_FAILURE],
      callAPI: () => fetch('/order/create', params), 
    }
  },
  senderSearch,
  editOredr, 
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  /**
   * 编辑车配任务请求数据填充页面
   */
  [ADDDISTRIBUTION_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [ADDDISTRIBUTION_SUCCESS]: (state, action) => {
    // let newReceiverFormNo = state.receiverFormNo
    // newReceiverFormNo = action.payload.receiversInfoList.length - 1 // TODO
    // let newRecord = state.record

    let newState = Object.assign({}, state)
    let newRecord = Object.assign({}, newState.record)

    newRecord.shopName.value = action.payload.shopName
    newRecord.userName.value = action.payload.userName
    newRecord.phone.value = action.payload.phone
    newRecord.region.value = [action.payload.province, action.payload.city, action.payload.area]
    newRecord.addressDetail.value = action.payload.addressDetail
    if (!newRecord.drivingTime) {
      newRecord.drivingTime = {}
    }
    if (!action.payload.drivingTime) { // 非必填字段
      newRecord.drivingTime.value = ''
    } else {
      newRecord.drivingTime.value = formatDate(Number(action.payload.drivingTime), 'yyyy-MM-dd HH:mm')
    }
    
    action.payload.receiversInfoList.forEach((item, index) => {
      // createEmptyObject(newRecord[`${index}region`])
      if (!newRecord[`${index}region`]) {
        newRecord[`${index}region`] = {}
      }
      newRecord[`${index}region`].value = [item.province, item.city, item.area]
      
      if (!newRecord[`${index}addressDetail`]) {
        newRecord[`${index}addressDetail`] = {}
      }
      newRecord[`${index}addressDetail`].value = item.addressDetail
      
      if (!newRecord[`${index}phone`]) {
        newRecord[`${index}phone`] = {}
      }
      newRecord[`${index}phone`].value = item.phone
      
      if (!newRecord[`${index}shopName`]) {
        newRecord[`${index}shopName`] = {}
      }
      newRecord[`${index}shopName`].value = item.shopName
      
      if (!newRecord[`${index}userName`]) {
        newRecord[`${index}userName`] = {}
      }
      newRecord[`${index}userName`].value = item.userName
      
      if (!newRecord[`${index}deliveryBeginTime`]) {
        newRecord[`${index}deliveryBeginTime`] = {}
      }
      if (!item.deliveryBeginTime) { // 非必填字段
        newRecord[`${index}deliveryBeginTime`].value = ''
      } else {
        newRecord[`${index}deliveryBeginTime`].value = 
        formatDate(Number(item.deliveryBeginTime), 'yyyy-MM-dd HH:mm')
      }
  
      if (!newRecord[`${index}deliveryEndTime`]) {
        newRecord[`${index}deliveryEndTime`] = {}
      }
      if (!item.deliveryEndTime) { // 非必填字段
        newRecord[`${index}deliveryEndTime`].value = ''
      } else {
        newRecord[`${index}deliveryEndTime`].value = 
        formatDate(Number(item.deliveryEndTime), 'yyyy-MM-dd HH:mm')
      }
    })
    newState.record = newRecord

    // 再来实现 怎么增加2条收货地址 浅拷贝 和 深拷贝
    let newReceiverFields = action.payload.receiversInfoList.map((item, index) => {
      return {
        id: index.toString(),
        fields:[
          {
            'label': '商家名称',
            'name': `${index}shopName`,
            'required': true,
            'max': 20,
          },
          {
            'label': '联系人',
            'name': `${index}userName`,
            'required': true,
            'max': 20,
          },
          {
            'label': '联系电话',
            'name': `${index}phone`,
            'required': true,
            'phone': true,
          },
          {
            'label': '送达起始时间',
            'name': `${index}deliveryBeginTime`,
            'required': false,
            'type': 'datetime',
          },
          {
            'label': '收货地区',
            'required': true,
            'name': `${index}region`,
            'type': 'Cascader',
            'data': addr,
            'changeOnSelect': 'true', // 每选择一项就会马上改变
          },
          {
            'label': '送达结束时间',
            'name': `${index}deliveryEndTime`,
            'required': false,
            'type': 'datetime',
          },
          {
            'label': '详细地址',
            'name': `${index}addressDetail`,
            'required': true,
            'type': 'textarea',
            'max': 60,
          },
        ],
      }
    })
    
    newState.receiverFields = newReceiverFields
    newState.receiverFormNo = action.payload.receiversInfoList.length - 1
    newState.loading = false
    newState.data = action.payload
    return newState
  },
  [ADDDISTRIBUTION_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      loading: false,
      data: {},
    }
  },

  /**
   * 增加收货地址
   */
  [ADDDISTRIBUTION_ADD_RECEIVER_INFO]: (state, action) => {
    let numId = state.receiverFormNo
    numId++
    let receiverFields = state.receiverFields
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
          'label': '收货地区',
          'required': true,
          'name': numId + 'region',
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
        },
        {
          'label': '送达结束时间',
          'name': numId + 'deliveryEndTime',
          'required': false,
          'type': 'datetime',
        },
        {
          'label': '详细地址',
          'name': numId + 'addressDetail',
          'required': true,
          'type': 'textarea',
          'max': 60,
        },
      ],
    })
    let record = state.record
    record[`${numId}region`] = {
      value: ['浙江省', '杭州市', '江干区'],
    }
    record[`${numId}addressDetail`] = {
      value: '',
    }

    let newState = {
      ...state,
      receiverFormNo:numId,
      receiverFields,
      record,
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

    delete newState.record[`${action.id}region`]
    delete newState.record[`${action.id}addressDetail`]
    delete newState.record[`${action.id}shopName`]
    delete newState.record[`${action.id}userName`]
    delete newState.record[`${action.id}phone`]
    delete newState.record[`${action.id}deliveryEndTime`]
    delete newState.record[`${action.id}deliveryBeginTime`]

    let newRecord = Object.assign({}, newState.record)
    newState.record = newRecord
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
    // message.success('搜索成功')
    let newState = Object.assign({}, state)
    newState.newSenderInfos = action.payload.list
    // 自动填充完毕后，要把errors清除
    newState.record.userName.errors = false
    newState.record.phone.errors = false
    newState.record.region.errors = false
    newState.record.addressDetail.errors = false
    return newState
  },
  [ADDDISTRIBUTION_SENDER_SEARCH_FAILURE]: (state, action) => {
    message.error(action.payload) // 没有使用callAPI封装的action时候，根据action.payload对应获取
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
    }
  },
  [ADDDISTRIBUTION_SUBMIT_FAILURE]: (state, action) => {
    message.error(action.msg) // 使用callAPI封装的action时候直接action.msg就可得到错误信息
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
   * 清空数据，回到初始界面
   */
  [ADDDISTRIBUTION_CLEAR_DATA]: (state, action) => {
    return {
      ...state,
      receiverFormNo: 0,
      record: { 
        region: {
          value: ['浙江省', '杭州市', '江干区'],
        },
        '0region': { 
          value: ['浙江省', '杭州市', '江干区'],
        },
        addressDetail: {
          value: '',
        },
        '0addressDetail': {
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
      newSenderInfos:[],
      receiverFields:[
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
              'label': '收货地区',
              'required': true,
              'name': '0region',
              'type': 'Cascader',
              'data': addr,
              'changeOnSelect': 'true', // 每选择一项就会马上改变
            },
            {
              'label': '送达结束时间',
              'name': '0deliveryEndTime',
              'required': false,
              'type': 'datetime',
            },
            {
              'label': '详细地址',
              'name': '0addressDetail',
              'required': true,
              'type': 'textarea',
              'max': 60,
            },
          ],
        },
      ],
    }
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
          'label': '收货地区',
          'required': true,
          'name': '0region',
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
        },
        {
          'label': '送达结束时间',
          'name': '0deliveryEndTime',
          'required': false,
          'type': 'datetime',
        },
        {
          'label': '详细地址',
          'name': '0addressDetail',
          'required': true,
          'type': 'textarea',
          'max': 60,
        },
      ],
    },
  ],
  record: { // 用来保存填写的表单数据
    region: {
      value: ['浙江省', '杭州市', '江干区'],
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
    '0region': { 
      value: ['浙江省', '杭州市', '江干区'],
    },
    '0addressDetail': {
      value: '',
    },
    '0shopName': {
      value: '',
    },
    '0userName': {
      value: '',
    },
    '0phone': {
      value: '',
    },
  }, 
  newSenderInfos: [], // 发货方搜索自动填充信息
  searchParams: {},
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
