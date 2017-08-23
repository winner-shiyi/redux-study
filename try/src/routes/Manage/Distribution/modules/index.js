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
const DISTRIBUTION_SEARCH_RESET = 'DISTRIBUTION_SEARCH_RESET'
const DISTRIBUTION_SET_STATUS_REQUEST = 'DISTRIBUTION_SET_STATUS_REQUEST'
const DISTRIBUTION_SET_STATUS_SUCCESS = 'DISTRIBUTION_SET_STATUS_SUCCESS'
const DISTRIBUTION_SET_STATUS_FAILURE = 'DISTRIBUTION_SET_STATUS_FAILURE'
const DISTRIBUTION_ENTRY_SHOW = 'DISTRIBUTION_ENTRY_SHOW'
const DISTRIBUTION_ENTRY_CANCEL = 'DISTRIBUTION_ENTRY_CANCEL'

// ------------------------------------
// Actions
// ------------------------------------

const request = (params) => {
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
    return fetch('/order/list', params) 
      .then(json => {
        if (json.resultCode === '0') {
          dispatch(success(json.resultData))
        } else {
          dispatch(failure(json.resultDesc))
        }
      })
  }
}

const downExcel = () => {
  return dispatch => {
    fetch('/order/downExcel')
      .then(json => {
        let binaryData = []
        binaryData.push(json)
        const downloadUrl = window.URL.createObjectURL(new Blob(binaryData, { type: 'application/zip' }))
        // const downloadUrl = window.URL.createObjectURL(json)  // todo 
        let a = document.createElement('a')
        a.href = downloadUrl
        a.download = '车配导入订单模板.xlsx'
        document.body.appendChild(a)
        a.click()
      })
  }
}

export const actions = {
  reset: createAction(DISTRIBUTION_SEARCH_RESET),
  changeSearch: createAction(DISTRIBUTION_CHANGE_SEARCH, 'fields'),
  search,
  setStatus: (params) => {
    return {
      types: [DISTRIBUTION_SET_STATUS_REQUEST, DISTRIBUTION_SET_STATUS_SUCCESS, DISTRIBUTION_SET_STATUS_FAILURE],
      callAPI: () => fetch('/order/cancel', { // 订单编号
        orderNo: params.orderNo, 
      }),
    }
  },
  showModal: createAction(DISTRIBUTION_ENTRY_SHOW),
  cancel: createAction(DISTRIBUTION_ENTRY_CANCEL),
  downExcel,
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
      data: action.payload.list, // 没有使用callAPI方法，通过原始传入payload: data
      page: {
        ...state.page,
        pageNo: action.payload.pageNo,
        pageSize: action.payload.pageSize,
        total: action.payload.total,
      },
    }
  },
  [DISTRIBUTION_FAILURE]: (state, action) => {
    message.error(action.payload) // 没有使用callAPI方法,因为原始传入的dispatch(failure(json.resultDesc))就是msg
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
    message.error(action.msg) // 这里调接口的时候使用了callAPI方法，可以在creatStore里面看到封装返回msg
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
  [DISTRIBUTION_ENTRY_SHOW]: (state, action) => {
    return {
      ...state,
      visible: true,
    }
  },
  [DISTRIBUTION_ENTRY_CANCEL]: (state, action) => {
    return {
      ...state,
      visible: false,
    }
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  visible: false,
  loading: false,
  page: {
    pageNo: '1',
    pageSize: '10',
    total: '0',
  },
  searchParams: {
  },
}
export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
