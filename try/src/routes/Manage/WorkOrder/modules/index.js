import { message } from 'antd'
import { createAction } from '../../../../util'
import fetch from '../../../../util/fetch'

// ------------------------------------
// Constants
// ------------------------------------
const WORKORDER_ADD = 'WORKORDER_ADD'
const WORKORDER_EDIT = 'WORKORDER_EDIT'
const WORKORDER_ADDEDIT_CANCEL = 'WORKORDER_ADDEDIT_CANCEL'
const WORKORDER_REQUEST = 'WORKORDER_REQUEST'
const WORKORDER_SUCCESS = 'WORKORDER_SUCCESS'
const WORKORDER_FAILURE = 'WORKORDER_FAILURE'
const WORKORDER_GARDEN_REQUEST = 'WORKORDER_GARDEN_REQUEST'
const WORKORDER_GARDEN_SUCCESS = 'WORKORDER_GARDEN_SUCCESS'
const WORKORDER_GARDEN_FAILURE = 'WORKORDER_GARDEN_FAILURE'
const WORKORDER_SEARCH_CHANGE = 'WORKORDER_SEARCH_CHANGE'
const WORKORDER_SAVE_REQUEST = 'WORKORDER_SAVE_REQUEST'
const WORKORDER_SAVE_SUCCESS = 'WORKORDER_SAVE_SUCCESS'
const WORKORDER_SAVE_FAILURE = 'WORKORDER_SAVE_FAILURE'
const WORKORDER_SET_STATUS_REQUEST = 'WORKORDER_SET_STATUS_REQUEST'
const WORKORDER_SET_STATUS_SUCCESS = 'WORKORDER_SET_STATUS_SUCCESS'
const WORKORDER_SET_STATUS_FAILURE = 'WORKORDER_SET_STATUS_FAILURE'
const WORKORDER_RECORD_CHANGE = 'WORKORDER_RECORD_CHANGE'
const WORKORDER_SEARCH_RESET = 'WORKORDER_SEARCH_RESET'

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  add: createAction(WORKORDER_ADD),
  reset: createAction(WORKORDER_SEARCH_RESET),
  edit: createAction(WORKORDER_EDIT, 'record'),
  cancel: createAction(WORKORDER_ADDEDIT_CANCEL),
  changeSearch: createAction(WORKORDER_SEARCH_CHANGE, 'fields'),
  changeRecord: createAction(WORKORDER_RECORD_CHANGE, 'fields'),
  gardenSearch: (params) => {
    return {
      types: [WORKORDER_GARDEN_REQUEST, WORKORDER_GARDEN_SUCCESS, WORKORDER_GARDEN_FAILURE],
      callAPI: () => fetch('/garden/list', params),
      // callback: (payload, dispatch, state) => {
      //   console.log(arguments)
      // },
    }
  },
  search: (params) => {
    return {
      types: [WORKORDER_REQUEST, WORKORDER_SUCCESS, WORKORDER_FAILURE],
      callAPI: () => fetch('/repairbill/list', params),
    }
  },
  save: (params) => {
    return {
      types: [WORKORDER_SAVE_REQUEST, WORKORDER_SAVE_SUCCESS, WORKORDER_SAVE_FAILURE],
      callAPI: () => fetch('/repairbill/' + (params.id ? 'update' : 'add'), params),
    }
  },
  setStatus: (params) => {
    return {
      types: [WORKORDER_SET_STATUS_REQUEST, WORKORDER_SET_STATUS_SUCCESS, WORKORDER_SET_STATUS_FAILURE],
      callAPI: () => fetch('/repairbill/status', {
        id: params.id,
      }),
    }
  },
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [WORKORDER_ADD]    : (state, action) => {
    let newState = {
      ...state,
      modalVisible: true,
      record: state.defaultRecord,
      isEdit: false,
    }
    return newState
  },
  [WORKORDER_EDIT]    : (state, action) => {
    let newState = {
      ...state,
      modalVisible: true,
      record: action.record,
      isEdit: true,
    }
    return newState
  },
  [WORKORDER_ADDEDIT_CANCEL]: (state, action) => {
    return {
      ...state,
      modalVisible: false,
    }
  },
  [WORKORDER_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [WORKORDER_SUCCESS]: (state, action) => {
    return {
      ...state,
      loading: false,
      data: action.data.list,
      page: {
        ...state.page,
        pageNo: action.data.pageNo,
        pageSize: action.data.pageSize,
        count: action.data.count,
      },
    }
  },
  [WORKORDER_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
      loading: false,
    }
  },
  [WORKORDER_GARDEN_REQUEST]: (state, action) => {
    return {
      ...state,
      garden: {
        ...state.garden,
        loading: true,
      },
    }
  },
  [WORKORDER_GARDEN_SUCCESS]: (state, action) => {
    return {
      ...state,
      garden: {
        ...state.garden,
        loading: false,
        data: action.data.list,
      },
      searchParams:{
        gardenId:{
          value:action.data.list[0].id,
          errors:false,
        },
      },
    }
  },
  [WORKORDER_GARDEN_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
      garden: {
        ...state.garden,
        loading: false,
      },
    }
  },
  [WORKORDER_SEARCH_CHANGE]: (state, action) => {
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...action.fields,
      },
    }
  },
  [WORKORDER_RECORD_CHANGE]: (state, action) => {
    return {
      ...state,
      record: {
        ...state.record,
        ...action.fields,
      },
    }
  },
  [WORKORDER_SAVE_REQUEST]: (state, action) => {
    return {
      ...state,
      confirmLoading: true,
    }
  },
  [WORKORDER_SAVE_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      confirmLoading: false,
      modalVisible: false,
      record: {},
    }
  },
  [WORKORDER_SAVE_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
      confirmLoading: false,
    }
  },
  [WORKORDER_SET_STATUS_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [WORKORDER_SET_STATUS_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      loading: false,
    }
  },
  [WORKORDER_SET_STATUS_FAILURE]: (state, action) => {
    message.error(action.msg)
    return {
      ...state,
      loading: false,
    }
  },
  [WORKORDER_SEARCH_RESET]  : (state, action) => {
    return {
      ...state,
      searchParams: {
        gardenId: {
          value: state.garden.data[0].id,
        },
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
  visible: false,
  title: '工单管理',
  name: '工单',
  defaultRecord: {
    'status': 0,
  },
  garden: {
    data: [],
    loading: false,
  },
  searchParams: {
    gardenId:{
      value: ' ',
    },
  },
  page: {
    pageNo: 1,
    pageSize: 10,
  },
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
