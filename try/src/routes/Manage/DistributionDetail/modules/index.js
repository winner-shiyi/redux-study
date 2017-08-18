import { message } from 'antd'
import { createAction } from '../../../../util'
import fetch from '../../../../util/fetch';
import { formatDate } from 'util/date';

// ------------------------------------
// Constants
// ------------------------------------
const DISTRIBUTION_ORDER_DETAIL_REQUEST = 'DISTRIBUTION_ORDER_DETAIL_REQUEST';
const DISTRIBUTION_ORDER_DETAIL_SUCCESS = 'DISTRIBUTION_ORDER_DETAIL_SUCCESS';
const EDISTRIBUTION_ORDER_DETAIL_FAILURE = 'EDISTRIBUTION_ORDER_DETAIL_FAILURE';
const SEAECH_DRIVER_REQUEST = 'SEAECH_DRIVER_REQUES';
const SEAECH_DRIVER_SUCCESS = 'SEAECH_DRIVER_SUCCESS';
const SEAECH_DRIVER_FAILURE = 'SEAECH_DRIVER_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  Detail: (params) => {
    return {
      types: [DISTRIBUTION_ORDER_DETAIL_REQUEST, DISTRIBUTION_ORDER_DETAIL_SUCCESS, EDISTRIBUTION_ORDER_DETAIL_FAILURE],
      //callAPI:() =>fetch('http://172.16.25.64:8081/mock/DistributionOrderDetail.json',params,{
      callAPI:() =>fetch('/order/detail',params,{
        method: 'POST',
      })
    }
  },
  searchDriver:(params)=>{
    return {
      types: [SEAECH_DRIVER_REQUEST, SEAECH_DRIVER_SUCCESS, SEAECH_DRIVER_FAILURE],
      //callAPI:() =>fetch('http://172.16.25.64:8081/mock/DriverInfo.json',params,{
      callAPI:() =>fetch('/order/cardInfo',params,{
        method: 'POST',
      })
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISTRIBUTION_ORDER_DETAIL_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [DISTRIBUTION_ORDER_DETAIL_SUCCESS]: (state, action) => {
    let newState = Object.assign({}, state);
    let { data } = action;
    let orderStatus=data.orderStatus;
    let dictionary = {
      '0':'初始',
      '1':'待分配',
      '2':'待取货',
      '3':'配送中',
      '4':'已完成',
      '5':'已取消',
    };
    orderStatus = dictionary[orderStatus];
    newState.data = Object.assign(newState.data,data);
    newState.data=Object.assign({},newState.data,{
      orderStatus:data.orderStatus || '-',
      address:data.senderInfo.address || '-',
      shopName:data.senderInfo.shopName || '-',
      phone:data.senderInfo.phone || '-',
      dispatchTime:data.dispatchOrderTime ? formatDate(data.dispatchOrderTime,'yyyy-MM-dd HH:mm:ss') : '-',
      orderTime:data.orderTime ? formatDate(data.orderTime,'yyyy-MM-dd HH:mm:ss') : '-'
    });

    return {
      ...newState,
      orderStatus:orderStatus,
    }
  },
  [EDISTRIBUTION_ORDER_DETAIL_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
    }
  },
  [SEAECH_DRIVER_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [SEAECH_DRIVER_SUCCESS]: (state, action) => {
    let { data } = action;
    let newState = Object.assign({}, state);
    let dictionary = {
      "0":"面包",
      "1":"平板",
      "2":"高栏",
      "3":"厢式",
      "4":"冷链"
    };
    let carType;
    newState.data = Object.assign({},newState.data,data);
    newState.data = Object.assign({},newState.data,{
      carType:dictionary[data.carType]
    });
    return {
      ...newState,
    }
  },
  [SEAECH_DRIVER_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
    }
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  "note": "",
  "orderNo": "",
  "orderStatus":1,
  "dispatchTime": "",
  "orderTime": "",
  waybillStatus: '',
  data:{
    receiversInfoList:[],
  }
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
