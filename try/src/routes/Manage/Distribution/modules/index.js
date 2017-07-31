import fetch from '../../../../util/fetch'
import { message } from 'antd'
import { createAction } from '../../../../util'
// ------------------------------------
// Constants
// ------------------------------------

const DISTRIBUTION_REQUEST = 'DISTRIBUTION_REQUEST'
const DISTRIBUTION_SUCCESS = 'DISTRIBUTION_SUCCESS'
const DISTRIBUTION_FAILURE = 'DISTRIBUTION_FAILURE'
const DISTRIBUTION_CHANGE_SEARCH = 'DISTRIBUTION_CHANGE_SEARCH'
const DISTRIBUTION_CHANGE_RECORD = 'DISTRIBUTION_CHANGE_RECORD' // todo 等待验证这个页面是否需要
const DISTRIBUTION_SEARCH_RESET = 'DISTRIBUTION_SEARCH_RESET'
const DISTRIBUTION_SET_STATUS_REQUEST = 'DISTRIBUTION_SET_STATUS_REQUEST'
const DISTRIBUTION_SET_STATUS_SUCCESS = 'DISTRIBUTION_SET_STATUS_SUCCESS'
const DISTRIBUTION_SET_STATUS_FAILURE = 'DISTRIBUTION_SET_STATUS_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------

const request = () => {
  return {
    type: DISTRIBUTION_REQUEST,
  }
}

const success = (data) => {
  return {
    type: DISTRIBUTION_SUCCESS,
    payload: data,
  }
}

const failure = (msg) => {
  return {
    type: DISTRIBUTION_FAILURE,
    payload: msg,
  }
}

const search = (params) => { // 第一次进入页面
  return dispatch => {
    dispatch(request(params))
    fetch('//' + location.host + '/mock/distributions.json', params, {
      method: 'GET',
    })
      .then(json => {
        if (json.resultCode === '0000') {
          dispatch(success(json.resultData))
        } else {
          dispatch(failure(json.resultDesc))
        }
      })
  }
}

export const actions = {
  reset: createAction(DISTRIBUTION_SEARCH_RESET),
  changeSearch: createAction(DISTRIBUTION_CHANGE_SEARCH, 'fields'),
  changeRecord: createAction(DISTRIBUTION_CHANGE_RECORD, 'fields'),
  // search: (params) => {
  //   return {
  //     types: [DISTRIBUTION_REQUEST, DISTRIBUTION_SUCCESS, DISTRIBUTION_FAILURE],
  //     callAPI: () => fetch('//' + location.host + '/mock/distributions.json', params, {
  //       method: 'GET',
  //     }),
  //   }
  // },
  search,
  setStatus: (params) => {
    return {
      types: [DISTRIBUTION_SET_STATUS_REQUEST, DISTRIBUTION_SET_STATUS_SUCCESS, DISTRIBUTION_SET_STATUS_FAILURE],
      callAPI: () => fetch('/repairbill/status', { // 订单编号
        id: params.orderNo, 
      }),
    }
  },
  
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [DISTRIBUTION_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [DISTRIBUTION_SUCCESS]: (state, action) => {
    return {
      ...state,
      loading: false,
      data: action.payload.list, // todo action.data.list
      page: {
        ...state.page,
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
      },
    }
  },
  [DISTRIBUTION_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
      loading: false,
      data: [],
    }
  },
  [DISTRIBUTION_CHANGE_SEARCH]: (state, action) => {
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...action.fields,
      },
    }
  },
  [DISTRIBUTION_CHANGE_RECORD]: (state, action) => {
    return {
      ...state,
      record: {
        ...state.record,
        ...action.fields,
      },
    }
  },
  [DISTRIBUTION_SET_STATUS_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [DISTRIBUTION_SET_STATUS_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      loading: false,
    }
  },
  [DISTRIBUTION_SET_STATUS_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
      loading: false,
    }
  },
  [DISTRIBUTION_SEARCH_RESET]: (state, action) => {
    return {
      ...state,
      searchParams: {
        'pageNo':'1',
        'pageSize':'10',
      },
    }
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  loading: false,
  page: {
    pageNo: 1,
    pageSize: 10,
    total: 0,
  },
  searchParams: {
  },
  record: {},
}
export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
