import { message } from 'antd';
import { createAction } from '../../../../util';
import fetch from '../../../../util/fetch';
import moment from 'moment';
import {browserHistory} from 'react-router';

// ------------------------------------
// Constants
// ------------------------------------
const CHOOSE_DRIVER_CARSEARCH_REQUEST = 'CHOOSE_DRIVER_CARSEARCH_REQUEST'
const CHOOSE_DRIVER_CARSEARCH_SUCCESS = 'CHOOSE_DRIVER_CARSEARCH_SUCCESS'
const CHOOSE_DRIVER_CARSEARCH_FAILURE = 'CHOOSE_DRIVER_CARSEARCH_FAILURE'

const CHOOSE_DRIVER_SEARCH_REQUEST = 'CHOOSE_DRIVER_SEARCH_REQUEST'
const CHOOSE_DRIVER_SEARCH_SUCCESS = 'CHOOSE_DRIVER_SEARCH_SUCCESS'
const CHOOSE_DRIVER_SEARCH_FAILURE = 'CHOOSE_DRIVER_SEARCH_FAILURE'

const CHOOSE_DRIVER_DISPATCHORDER_REQUEST = 'CHOOSE_DRIVER_DISPATCHORDER_REQUEST'
const CHOOSE_DRIVER_DISPATCHORDER_SUCCESS = 'CHOOSE_DRIVER_DISPATCHORDER_SUCCESS'
const CHOOSE_DRIVER_DISPATCHORDER_FAILURE = 'CHOOSE_DRIVER_DISPATCHORDER_FAILURE'

const CHOOSE_DRIVER_MOCK_RADIO = 'CHOOSE_DRIVER_MOCK_RADIO'

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  /*changeSearch: createAction(EXPRESSAGE_SELECTSEARCH, 'fields'),
  sendNoteStatus: createAction(EXPRESSAGE_NOTESTATUS, 'fields'),*/
  mockRadio: createAction(CHOOSE_DRIVER_MOCK_RADIO, 'driverId'),
  searchCar: (params) => {
    return {
      types: [CHOOSE_DRIVER_CARSEARCH_REQUEST, CHOOSE_DRIVER_CARSEARCH_SUCCESS, CHOOSE_DRIVER_CARSEARCH_FAILURE],
      callAPI: () => fetch('//' + location.host + '/mock/SearchCar.json', params,{
        method: 'GET',
      }),
    }
  },
  searchDriver: (params) => {
    return {
      types: [CHOOSE_DRIVER_SEARCH_REQUEST, CHOOSE_DRIVER_SEARCH_SUCCESS, CHOOSE_DRIVER_SEARCH_FAILURE],
      //callAPI: () => fetch('http://172.16.25.64:8081/mock/DriverSearchList.json', params,{
      callAPI: () => fetch('/order/driver/list', params,{
        method:'POST',
      }),
    }
  },
  dispatchOrder: (params) => {
    return {
      types: [CHOOSE_DRIVER_DISPATCHORDER_REQUEST, CHOOSE_DRIVER_DISPATCHORDER_SUCCESS, CHOOSE_DRIVER_DISPATCHORDER_FAILURE],
      callAPI: () => fetch('/order/dispatch', params,{
        method:'POST',
      }),
    }
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CHOOSE_DRIVER_CARSEARCH_REQUEST] : (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [CHOOSE_DRIVER_CARSEARCH_SUCCESS] : (state, action) => {
    let newState = Object.assign({}, state)
    let { data } = action;
    let carClassesData = data;
    return {
      carClassesData,
      ...newState
    }
  },
  [CHOOSE_DRIVER_CARSEARCH_FAILURE] : (state, action) => {
    message.error(action.msg);
    return {
      ...state,
      loading: false,
    }
  },
  [CHOOSE_DRIVER_SEARCH_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [CHOOSE_DRIVER_SEARCH_SUCCESS] : (state, action) => {
    let newState = Object.assign({}, state);
    let { data } = action;
    let driverList = data.list;
    let dictionary = {
      "0":"面包",
      "1":"平板",
      "2":"高栏",
      "3":"厢式",
      "4":"冷链"
    };
    let isCanChoose = [];
    if(driverList && driverList !=0 ){
      driverList.map((item,index)=>{
        item.key = index;
        item.id = index;
        item.lock = true; // 给每个list增加一个变量锁
        // if(item.driverWorkStatus==0){
        //   isCanChoose.push(1);
        //   item.driverWorkStatus = '配送中';
        // }else if(item.driverWorkStatus==1){
        //   isCanChoose.push(1);
        //   item.driverWorkStatus = '已完成';
        // }
        isCanChoose.push(1)
        item.carType = dictionary[item.carType];

      })
    }

    newState.data.driverList = driverList;
    newState.data = Object.assign({},newState.data,data);

    return {
      ...newState,
      isCanChoose,
      loading: false,
      page: {
        ...state.page,
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        count: data.total,
      },
    }
  },
  [CHOOSE_DRIVER_MOCK_RADIO] : (state, action) => {
    let newState = Object.assign({}, state)
    let driverList = newState.data.list
    if (driverList.length !== 0) {
      driverList.map((item, index) => {
        if (item.driverId === action.driverId) {
          item.lock = !item.lock
        }
      })
    }
    newState.data.driverList = driverList
    return {
      ...state,
      data: newState.data,
    }
  },
  [CHOOSE_DRIVER_SEARCH_FAILURE] : (state, action) => {
    message.error(action.msg)
    return {
      ...state,
    }
  },
  [CHOOSE_DRIVER_DISPATCHORDER_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [CHOOSE_DRIVER_DISPATCHORDER_SUCCESS] : (state, action) => {
    let newState = Object.assign({}, state);
    let { data } = action;
    newState.data = Object.assign({},newState.data,data);
    let paths = "/Manage/Distribution";
    return {
      ...newState,
      paths,
      loading: false,
    }
  },
  [CHOOSE_DRIVER_DISPATCHORDER_FAILURE] : (state, action) => {
    if(action.msg == 'driverId不能为空' ){
      message.error('请选择司机');
    }else{
      message.error(action.msg);
    }
    let paths = false;
    return {
      ...state,
      paths
    }
  },

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  noteStatusData: [],
  exportStatusData: [],
  data: {
    driverList:[],
  },
  driverStatus:[
    ["0","配送中"],
    ["1","已完成"]
  ],
  page: {
    current: 1,
    pageSize: 10,
    count: 0,
    pageNo: 1,
  },
  searchParams: {
    pageNo: 1,
    pageSize: 10,
    driverName:'',
    carType:'',
    carNumber:'',
  },
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

