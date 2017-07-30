import { message } from 'antd'
import { createAction } from '../../../../util'
import fetch from '../../../../util/fetch'
import addr from '../../../../../public/mock/addr1.json'

// ------------------------------------
// Constants
// ------------------------------------
const TPL_HELLO = 'TPL_HELLO'
const ADDDISTRIBUTION_ADD_RECEIVER_INFO = 'ADDDISTRIBUTION_ADD_RECEIVER_INFO'
const ADDDISTRIBUTION_REDUCE_RECEIVER_INFO = 'ADDDISTRIBUTION_REDUCE_RECEIVER_INFO'
const ADDDISTRIBUTION_RECORD_CHANGE = 'ADDDISTRIBUTION_RECORD_CHANGE'
// ------------------------------------
// Actions
// ------------------------------------

export const actions = {
  hello: createAction(TPL_HELLO),
  addReceiverInfo: createAction(ADDDISTRIBUTION_ADD_RECEIVER_INFO),
  reduceReceiverInfo: createAction(ADDDISTRIBUTION_REDUCE_RECEIVER_INFO, 'id'),
  changeRecord: createAction(ADDDISTRIBUTION_RECORD_CHANGE,'fields')
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
          'name': 'receiverShopName' + numId,
          'required': true,
          'max': 20,
        },
        {
          'label': '联系人',
          'name': 'receiverUserName' + numId,
          'required': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': 'receiverPhone' + numId,
          'required': true,
          'phone': true,
        },
        {
          'label': '送达时间',
          'name': 'receiverDeliveryTime' + numId,
          'required': false,
          'type': 'dateRange',
          'max': 50,
        },
        {
          'label': '收货地区',
          'required': true,
          'name': 'receiverArea' + numId,
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
        },
        {
          'label': '详细地址',
          'name': 'receiverAddressDetail' + numId,
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
    newReceiverFields.splice(index,1)
    newState.receiverFields = newReceiverFields
    return newState
  },
  /**
   * 表单数据改变更新
   */
  [ADDDISTRIBUTION_RECORD_CHANGE]: (state, action) => {
    return {
      ...state,
      record: {
        ...state.record,
        ...action.fields,
      },
    }
  },
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  receiverFormNo: 0,
  receiverFields:[
    {
      id:'0',
      fields:[
        {
          'label': '商家名称',
          'name': 'receiverShopName0',
          'required': true,
          'max': 20,
        },
        {
          'label': '联系人',
          'name': 'receiverUserName0',
          'required': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': 'receiverPhone0',
          'required': true,
          'phone': true,
        },
        {
          'label': '送达时间',
          'name': 'receiverDeliveryTime0',
          'required': false,
          'type': 'dateRange',
          'max': 50,
        },
        {
          'label': '收货地区',
          'required': true,
          'name': 'receiverArea0',
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
        },
        {
          'label': '详细地址',
          'name': 'receiverAddressDetail0',
          'required': true,
          'type': 'textarea',
          'max': 50,
        },
      ],
    },
  ],
  record:{}, // 用来保存填写的表单数据
  helloText: 'I’m a mother father gentleman',
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
