import { message } from 'antd'
import { createAction } from '../../../../util'
import fetch from '../../../../util/fetch'
import addr from '../../../../../public/mock/addr.json'

// ------------------------------------
// Constants
// ------------------------------------
const TPL_HELLO = 'TPL_HELLO'
const ADDDISTRIBUTION_ADD_RECEIVER_INFO = 'ADDDISTRIBUTION_ADD_RECEIVER_INFO'
const ADDDISTRIBUTION_REDUCE_RECEIVER_INFO = 'ADDDISTRIBUTION_REDUCE_RECEIVER_INFO'


// ------------------------------------
// Actions
// ------------------------------------
// const reduceReceiverInfo = (id) => {
//   return {
//     type: ADDDISTRIBUTION_REDUCE_RECEIVER_INFO,
//     payload: id,
//   }
// }
export const actions = {
  hello: createAction(TPL_HELLO),
  addReceiverInfo: createAction(ADDDISTRIBUTION_ADD_RECEIVER_INFO),
  reduceReceiverInfo: createAction(ADDDISTRIBUTION_REDUCE_RECEIVER_INFO, 'id'),
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
  [ADDDISTRIBUTION_ADD_RECEIVER_INFO]: (state, action) => {
    let numId = state.receiverFormNo
    // numId++
    let receiverFields = state.receiverFields

    receiverFields.push({
      id: ++numId,
      fields:[
        {
          'label': '商家名称',
          'name': 'shopName' + numId,
          'required': true,
          // 'simple': true,
          // 'long': true,
          'type': 'select',
          'valueName': 'id',
          'displayName': 'shopName',
          'state': {
            'data': [],
            'loading': false,
            'lastFetch': 0,
          },
        },
        {
          'label': '联系人',
          'name': 'userName' + numId,
          'required': true,
          // 'long': true,
          // 'simple': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': 'phone' + numId,
          'required': true,
          // 'long': true,
          // 'simple': true,
          'phone': true,
        },
        {
          'label': '用车时间',
          'name': 'drivingTime' + numId,
          'required': true,
          'type': 'datetime',
          // 'long': true,
          // 'simple': true,
          'max': 50,
        },
        {
          'label': '发货地区',
          'required': true,
          'name': 'area' + numId,
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
          // 'long': true,
          // 'simple': true,
        },
        {
          'label': '详细地址',
          'name': 'addressDetail' + numId,
          'required': true,
          'type': 'textarea',
          // 'long': true,
          // 'simple': true,
          // 'large': true,
          'max': 50,
        },
      ],
    })

    let newState = {
      ...state,
      receiverFormNo:numId,
      receiverFields,
    }
    return newState
  },
  [ADDDISTRIBUTION_REDUCE_RECEIVER_INFO]: (state, action) => {

    let newState = Object.assign({}, state)
    let newReceiverFields = [...newState.receiverFields]
    let index = newReceiverFields.findIndex(item => item.id === action.id)
    newReceiverFields.splice(index,1)
    newState.receiverFields = newReceiverFields
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  receiverFormNo:1,
  receiverFields:[
    {
      id:'1',
      fields:[
        {
          'label': '商家名称',
          'name': 'shopName',
          'required': true,
          // 'simple': true,
          // 'long': true,
          'type': 'select',
          'valueName': 'id',
          'displayName': 'shopName',
          'state': {
            'data': [],
            'loading': false,
            'lastFetch': 0,
          },
        },
        {
          'label': '联系人',
          'name': 'userName',
          'required': true,
          // 'long': true,
          // 'simple': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': 'phone',
          'required': true,
          // 'long': true,
          // 'simple': true,
          'phone': true,
        },
        {
          'label': '用车时间',
          'name': 'drivingTime',
          'required': true,
          'type': 'datetime',
          // 'long': true,
          // 'simple': true,
          'max': 50,
        },
        {
          'label': '发货地区',
          'required': true,
          'name': 'area',
          'type': 'Cascader',
          'data': addr,
          'changeOnSelect': 'true', // 每选择一项就会马上改变
          // 'long': true,
          // 'simple': true,
        },
        {
          'label': '详细地址',
          'name': 'addressDetail',
          'required': true,
          'type': 'textarea',
          // 'long': true,
          // 'simple': true,
          // 'large': true,
          'max': 50,
        },
      ],
    },
  ],
  helloText: 'I’m a mother father gentleman',
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
