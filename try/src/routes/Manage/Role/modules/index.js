import fetch from '../../../../util/fetch'
import { Message } from 'antd'
// ------------------------------------
// Constants
// ------------------------------------
const ROLE_ADD = 'ROLE_ADD'
const ROLE_EDIT = 'ROLE_EDIT'
const ROLE_ADDEDIT_CANCEL = 'ROLE_ADDEDIT_CANCEL'
const ROLE_SAVE_REQUEST = 'ROLE_SAVE_REQUEST'
const ROLE_SAVE_SUCCESS = 'ROLE_SAVE_SUCCESS'
const ROLE_SAVE_FAILURE = 'ROLE_SAVE_FAILURE'
const ROLE_REQUEST = 'ROLE_REQUEST'
const ROLE_SUCCESS = 'ROLE_SUCCESS'
const ROLE_FAILURE = 'ROLE_FAILURE'
const ROLE_DEL_REQUEST = 'ROLE_DEL_REQUEST'
const ROLE_DEL_SUCCESS = 'ROLE_DEL_SUCCESS'
const ROLE_DEL_FAILURE = 'ROLE_DEL_FAILURE'
const ROLE_TYPE_REQUEST = 'ROLE_TYPE_REQUEST'
const ROLE_TYPE_SUCCESS = 'ROLE_TYPE_SUCCESS'
const ROLE_TYPE_FAILURE = 'ROLE_TYPE_FAILURE'
const ROLE_CHANGE_SEARCH = 'ROLE_CHANGE_SEARCH'
const ROLE_VIEW = 'ROLE_VIEW'

// ------------------------------------
// Actions
// ------------------------------------
const add = () => {
  return {
    type: ROLE_ADD
  }
}

const cancel = () => {
  return {
    type: ROLE_ADDEDIT_CANCEL
  }
}

const edit = (record) => {
  return {
    type: ROLE_EDIT,
    payload: record,
  }
}

const view = (record) => {
  return {
    type: ROLE_VIEW,
    payload: record,
  }
}

const saveRequest = (record) => {
  return {
    type: ROLE_SAVE_REQUEST,
    payload: record
  }
}

const saveSuccess = (data) => {
  return {
    type: ROLE_SAVE_SUCCESS,
    payload: data
  }
}

const saveFailure = (msg) => {
  return {
    type: ROLE_SAVE_FAILURE,
    payload: msg,
  }
}

const save = (record) => {
  let temp = {
    ...record,
  }
  delete temp.id
  delete temp.name
  let menuList = []

  for (let i in temp) {
    !temp[i] && (temp[i] = [])
    if (temp[i].length > 0) {
      menuList = menuList.concat(temp[i], i.split(','))
    }
  }

  menuList.push('1')

  let set = new Set(menuList)
  menuList = [...set]

  let result = {
    id: record.id,
    name: record.name,
    menuIds: menuList.join(',').replace(',,', ','),
  }

  return dispatch => {
    dispatch(saveRequest(record))
    return fetch('/createRole', result)
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(saveSuccess(json.resultData))
          return true
        } else {
          dispatch(saveFailure(json.resultDesc))
        }
      })
  }
}

const request = () => {
  return {
    type: ROLE_REQUEST,
  }
}

const success = (res) => {
  return {
    type: ROLE_SUCCESS,
    payload: res,
  }
}

const failure = (msg) => {
  return {
    type: ROLE_FAILURE,
    payload: msg,
  }
}

const search = (params) => {
  return dispatch => {
    dispatch(request(params))
    fetch('/queryRole', params)
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(success(json.resultData))
        } else {
          dispatch(failure(json.resultDesc))
        }
      })
  }
}

const delRequest = (id) => {
  return {
    type: ROLE_DEL_REQUEST,
    payload: id
  }
}

const delSuccess = (id) => {
  return {
    type: ROLE_DEL_SUCCESS,
    payload: id
  }
}

const delFailure = (msg) => {
  return {
    type: ROLE_DEL_FAILURE,
    payload: msg
  }
}

const del = (id) => {
  return dispatch => {
    dispatch(delRequest(id))
    fetch('//localhost/ROLEData.json', {
      method: 'delete',
      body: {
        id: id
      }
    })
      .then(res => res.json())
      .then(json => dispatch(delSuccess(id)))
      .catch(e => dispatch(delFailure(e)))
  }
}

const typeRequest = (params) => {
  return {
    type: 'ROLE_TYPE_REQUEST',
    payload: params
  }
}

const typeSuccess = (data) => {
  return {
    type: 'ROLE_TYPE_SUCCESS',
    payload: data
  }
}

const typeFailure = (msg) => {
  return {
    type: 'ROLE_TYPE_FAILURE',
    payload: msg
  }
}

const typeSearch = (params, context) => {
  return dispatch => {
    dispatch(typeRequest(params))
    const curFetch = context.component.props.state.lastFetch
    fetch('/mock/ROLEType.json')
      .then(res => res.json())
      .then(json => {
        if (curFetch !== context.component.props.state.lastFetch) {
          return
        }
        if (json.resultCode == '200') {
          dispatch(typeSuccess(json.resultData))
        } else {
          dispatch(typeFailure(json.resultDesc))
        }
      })
      .catch(e => dispatch(typeFailure(e)))
  }
}

const changeSearch = (values) => {
  return {
    type: ROLE_CHANGE_SEARCH,
    payload: values,
  }
}

export const actions = {
  add,
  cancel,
  edit,
  view,
  save,
  search,
  del,
  typeSearch,
  changeSearch,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ROLE_ADD]: (state, action) => {
    let newState = {
      ...state,
      modalVisible: true,
      record: {},
      isView: false,
      formTitle: '新增角色',
    }

    let menuFields = []

    let formFields = newState.formFields.map(item => {
      item.disabled = false
      return item
    })
    newState.formFields = formFields
    return newState
  },
  [ROLE_ADDEDIT_CANCEL]: (state, action) => {
    return {
      ...state,
      modalVisible: false,
    }
  },
  [ROLE_EDIT]: (state, action) => {
    let newState = {
      ...state,
      record: action.payload,
      modalVisible: true,
      isView: false,
      formTitle: '配置权限',
    }
    let formFields = newState.formFields.map(item => {
      item.disabled = false
      return item
    })
    newState.formFields = formFields
    return newState
  },
  [ROLE_VIEW]: (state, action) => {
    let newState = {
      ...state,
      record: action.payload,
      modalVisible: true,
      isView: true,
      formTitle: '查看权限',
    }
    let formFields = newState.formFields.map(item => {
      item.disabled = true
      return item
    })
    newState.formFields = formFields
    return newState
  },
  [ROLE_SAVE_REQUEST]: (state, action) => {
    return {
      ...state,
      confirmLoading: true,
      record: action.payload,
    }
  },
  [ROLE_SAVE_SUCCESS]: (state, action) => {
    Message.success('操作成功')
    return {
      ...state,
      confirmLoading: false,
      modalVisible: false,
      record: {},
    }
  },
  [ROLE_SAVE_FAILURE]: (state, action) => {
    Message.error(action.payload)
    return {
      ...state,
      confirmLoading: false,
    }
  },
  [ROLE_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [ROLE_SUCCESS]: (state, action) => {
    return {
      ...state,
      loading: false,
      page: {
        ...state.page,
        pageNo: action.payload.pageNo,
        count: action.payload.count,
      },
      data: action.payload.list,
    }
  },
  [ROLE_FAILURE]: (state, action) => {
    return {
      ...state,
      loading: false,
      data: [],
    }
  },
  [ROLE_DEL_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [ROLE_DEL_SUCCESS]: (state, action) => {
    let newState = Object.assign({}, state, {
      loading: false,
    })
    let newData = [...newState.data]
    let index = newData.findIndex(item => item.key == action.payload)
    newData.splice(index, 1)
    newState.data = newData
    return newState
  },
  [ROLE_DEL_FAILURE]: (state, action) => {
    Message.error(action.payload.message)
    return {
      ...state,
      loading: false,
    }
  },
  [ROLE_TYPE_REQUEST]: (state, action) => {
    return {
      ...state,
      typeState: {
        ...state.typeState,
        loading: true,
      },
    }
  },
  [ROLE_TYPE_SUCCESS]: (state, action) => {
    return {
      ...state,
      typeState: {
        ...state.typeState,
        loading: false,
        data: action.payload.list,
      },
    }
  },
  [ROLE_TYPE_FAILURE]: (state, action) => {
    Message.error(action.payload.message)
    return {
      ...state,
      typeState: {
        ...state.typeState,
        loading: false,
      },
    }
  },
  [ROLE_CHANGE_SEARCH]: (state, action) => {
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...action.payload,
      },
    }
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  modalVisible: false,
  confirmLoading: false,
  loading: false,
  page: {
    pageNo: 1,
    pageSize: 10,
    count: 0,
  },
  typeState: {
    data: [],
    loading: false,
    lastFetch: 0,
  },
  record: {},
  formFields: [{
    label: '角色名称',
    name: 'name',
    required: true,
    max: 20,
  }, {
    label: '包含权限',
    type: 'title',
  }],
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
