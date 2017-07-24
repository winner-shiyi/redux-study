import fetch from '../../../../util/fetch'
import { message } from 'antd'
import { createAction } from '../../../../util'
// ------------------------------------
// Constants
// ------------------------------------
const GARDENUSER_ADD = 'GARDENUSER_ADD'
const GARDENUSER_EDIT = 'GARDENUSER_EDIT'
const GARDENUSER_ADDEDIT_CANCEL = 'GARDENUSER_ADDEDIT_CANCEL'
const GARDENUSER_SAVE_REQUEST = 'GARDENUSER_SAVE_REQUEST'
const GARDENUSER_SAVE_SUCCESS = 'GARDENUSER_SAVE_SUCCESS'
const GARDENUSER_SAVE_FAILURE = 'GARDENUSER_SAVE_FAILURE'
const GARDENUSER_REQUEST = 'GARDENUSER_REQUEST'
const GARDENUSER_SUCCESS = 'GARDENUSER_SUCCESS'
const GARDENUSER_FAILURE = 'GARDENUSER_FAILURE'
// const GARDENUSER_DEL_REQUEST = 'GARDENUSER_DEL_REQUEST'
// const GARDENUSER_DEL_SUCCESS = 'GARDENUSER_DEL_SUCCESS'
// const GARDENUSER_DEL_FAILURE = 'GARDENUSER_DEL_FAILURE'
const GARDENUSER_TYPE_REQUEST = 'GARDENUSER_TYPE_REQUEST'
const GARDENUSER_TYPE_SUCCESS = 'GARDENUSER_TYPE_SUCCESS'
const GARDENUSER_TYPE_FAILURE = 'GARDENUSER_TYPE_FAILURE'
const GARDENUSER_GARDEN_REQUEST = 'GARDENUSER_GARDEN_REQUEST'
const GARDENUSER_GARDEN_SUCCESS = 'GARDENUSER_GARDEN_SUCCESS'
const GARDENUSER_GARDEN_FAILURE = 'GARDENUSER_GARDEN_FAILURE'
const GARDENUSER_CHANGE_SEARCH = 'GARDENUSER_CHANGE_SEARCH'
const GARDENUSER_RESETPWD_REQUEST = 'GARDENUSER_RESETPWD_REQUEST'
const GARDENUSER_RESETPWD_SUCCESS = 'GARDENUSER_RESETPWD_SUCCESS'
const GARDENUSER_RESETPWD_FAILURE = 'GARDENUSER_RESETPWD_FAILURE'
const GARDENUSER_ACTIVE_REQUEST = 'GARDENUSER_ACTIVE_REQUEST'
const GARDENUSER_ACTIVE_SUCCESS = 'GARDENUSER_ACTIVE_SUCCESS'
const GARDENUSER_ACTIVE_FAILURE = 'GARDENUSER_ACTIVE_FAILURE'
const GARDENUSER_ROLE_REQUEST = 'GARDENUSER_ROLE_REQUEST'
const GARDENUSER_ROLE_SUCCESS = 'GARDENUSER_ROLE_SUCCESS'
const GARDENUSER_ROLE_FAILURE = 'GARDENUSER_ROLE_FAILURE'
const GARDENUSER_DETAIL_REQUEST = 'GARDENUSER_DETAIL_REQUEST'
const GARDENUSER_DETAIL_SUCCESS = 'GARDENUSER_DETAIL_SUCCESS'
const GARDENUSER_DETAIL_FAILURE = 'GARDENUSER_DETAIL_FAILURE'
const GARDENUSER_CHANGE_RECORD = 'GARDENUSER_CHANGE_RECORD'

// ------------------------------------
// Actions
// ------------------------------------
const add = () => {
  return dispatch => {
    dispatch({
      type: GARDENUSER_ADD,
    })
  }
}

const cancel = () => {
  return {
    type: GARDENUSER_ADDEDIT_CANCEL
  }
}

const edit = (record) => {
  return {
    type: GARDENUSER_EDIT,
    payload: record
  }
}

const saveRequest = (record) => {
  return {
    type: GARDENUSER_SAVE_REQUEST,
    payload: record
  }
}

const saveSuccess = (data) => {
  return {
    type: GARDENUSER_SAVE_SUCCESS,
    payload: data
  }
}

const saveFailure = (msg) => {
  return {
    type: GARDENUSER_SAVE_FAILURE,
    payload: msg
  }
}

const save = (record) => {
  return dispatch => {
    dispatch(saveRequest(record))
    return fetch('/saveUser', record)
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
    type: GARDENUSER_REQUEST,
  }
}

const success = (data) => {
  return {
    type: GARDENUSER_SUCCESS,
    payload: data,
  }
}

const failure = (msg) => {
  return {
    type: GARDENUSER_FAILURE,
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
        if (json.resultCode == '0000') {
          dispatch(success(json.resultData))
        } else {
          dispatch(failure(json.resultDesc))
        }
      })
  }
}

// const delRequest = (id) => {
//   return {
//     type: GARDENUSER_DEL_REQUEST,
//     payload: id
//   }
// }

// const delSuccess = (id) => {
//   return {
//     type: GARDENUSER_DEL_SUCCESS,
//     payload: id
//   }
// }

// const delFailure = (msg) => {
//   return {
//     type: GARDENUSER_DEL_FAILURE,
//     payload: msg
//   }
// }

const activeRequest = (record) => {
  return {
    type: GARDENUSER_ACTIVE_REQUEST,
    payload: record,
  }
}

const activeSuccess = () => {
  return {
    type: GARDENUSER_ACTIVE_SUCCESS,
  }
}

const activeFailure = (msg) => {
  return {
    type: GARDENUSER_ACTIVE_FAILURE,
    payload: msg,
  }
}

const active = (record) => {
  return dispatch => {
    dispatch(activeRequest(record))
    return fetch('/userStatus', {
      userId: record.id,
      status: record.accountStatus === '0' ? '1' : '0',
    })
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(activeSuccess(json.resultData))
        } else {
          dispatch(activeFailure(json.resultDesc))
        }
      })
  }
}

const typeRequest = (params) => {
  return {
    type: 'GARDENUSER_TYPE_REQUEST',
    payload: params
  }
}

const typeSuccess = (data) => {
  return {
    type: 'GARDENUSER_TYPE_SUCCESS',
    payload: data,
  }
}

const typeFailure = (msg) => {
  return {
    type: 'GARDENUSER_TYPE_FAILURE',
    payload: msg,
  }
}

const typeSearch = () => {
  return dispatch => {
    dispatch(typeRequest())
    fetch('/dict/list', {
      type: 'sys_account_prop',
    })
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(typeSuccess(json.resultData))
        } else {
          dispatch(typeFailure(json.resultDesc))
        }
      })
  }
}

const roleRequest = (params) => {
  return {
    type: 'GARDENUSER_ROLE_REQUEST',
    payload: params,
  }
}

const roleSuccess = (data) => {
  return {
    type: 'GARDENUSER_ROLE_SUCCESS',
    payload: data.list,
  }
}

const roleFailure = (msg) => {
  return {
    type: 'GARDENUSER_ROLE_FAILURE',
    payload: msg,
  }
}

const roleSearch = () => {
  return dispatch => {
    dispatch(roleRequest())
    fetch('/queryRole', {
      pageNo: '1',
      pageSize: '100000',
    })
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(roleSuccess(json.resultData))
        } else {
          dispatch(roleFailure(json.resultDesc))
        }
      })
  }
}

const resetPwdRequest = (params) => {
  return {
    type: 'GARDENUSER_RESETPWD_REQUEST',
    payload: params,
  }
}

const resetPwdSuccess = (data) => {
  return {
    type: 'GARDENUSER_RESETPWD_SUCCESS',
    payload: data,
  }
}

const resetPwdFailure = (msg) => {
  return {
    type: 'GARDENUSER_RESETPWD_FAILURE',
    payload: msg,
  }
}

const resetPwd = (params) => {
  return dispatch => {
    dispatch(resetPwdRequest(params))
    return fetch('/resetPWD', { id: params.id })
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(resetPwdSuccess(json.resultData))
          return json.resultData.password
        } else {
          dispatch(resetPwdFailure(json.resultDesc))
        }
      })
  }
}

const detailRequest = (record) => {
  return {
    type: GARDENUSER_DETAIL_REQUEST,
    payload: record,
  }
}

const detailSuccess = (data) => {
  return {
    type: GARDENUSER_DETAIL_SUCCESS,
    payload: data,
  }
}

const detailFailure = (msg) => {
  return {
    type: GARDENUSER_DETAIL_FAILURE,
    payload: msg,
  }
}

const detail = (record) => {
  return dispatch => {
    dispatch(detailRequest(record))
    return fetch('/userDetail', {
      id: record.id,
    })
      .then(json => {
        if (json.resultCode === '0000') {
          dispatch(detailSuccess(json.resultData))
          return true
        } else {
          dispatch(detailFailure(json.resultDesc))
        }
      })
  }
}

const changeSearch = (values) => {
  return {
    type: GARDENUSER_CHANGE_SEARCH,
    payload: values,
  }
}

export const actions = {
  add,
  cancel,
  edit,
  save,
  search,
  typeSearch,
  changeSearch,
  gardenSearch: (params) => {
    return {
      types: [GARDENUSER_GARDEN_REQUEST, GARDENUSER_GARDEN_SUCCESS, GARDENUSER_GARDEN_FAILURE],
      callAPI: (state) => fetch('/garden/list', params),
    }
  },
  roleSearch,
  resetPwd,
  active,
  detail,
  changeRecord: createAction(GARDENUSER_CHANGE_RECORD, 'fields'),
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GARDENUSER_ADD]: (state, action) => {
    let newState = {
      ...state,
      modalVisible: true,
      record: {},
      isEdit: false,
    }
    let roleField = newState.formFields.find((item) => {
      return item.name === 'roleId'
    })
    roleField.state = newState.roleState
    return newState
  },
  [GARDENUSER_ADDEDIT_CANCEL]: (state, action) => {
    return {
      ...state,
      modalVisible: false,
    }
  },
  [GARDENUSER_EDIT]: (state, action) => {
    let newState = {
      ...state,
      record: action.payload,
      modalVisible: true,
      isEdit: true,
      isMain: action.payload.accountProp === '1',
    }
    let roleField = newState.formEditFields.find((item) => {
      return item.name === 'roleId'
    })
    roleField.state = newState.roleState
    let roleMainField = newState.formMainFields.find((item) => {
      return item.name === 'roleId'
    })
    roleMainField.state = newState.roleState
    return newState
  },
  [GARDENUSER_SAVE_REQUEST]: (state, action) => {
    return {
      ...state,
      confirmLoading: true,
      record: action.payload,
    }
  },
  [GARDENUSER_SAVE_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      confirmLoading: false,
      modalVisible: false,
      record: {},
    }
  },
  [GARDENUSER_SAVE_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      confirmLoading: false,
    }
  },
  [GARDENUSER_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [GARDENUSER_SUCCESS]: (state, action) => {
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
  [GARDENUSER_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      loading: false,
      data: [],
    }
  },
  // [GARDENUSER_DEL_REQUEST]: (state, action) => {
  //   return {
  //     ...state,
  //     loading: true,
  //   }
  // },
  // [GARDENUSER_DEL_SUCCESS]: (state, action) => {
  //   let newState = Object.assign({}, state, {
  //     loading: false,
  //   })
  //   let newData = [...newState.data]
  //   let index = newData.findIndex(item => item.key === action.payload)
  //   newData.splice(index, 1)
  //   newState.data = newData
  //   return newState
  // },
  // [GARDENUSER_DEL_FAILURE]: (state, action) => {
  //   message.error(action.payload)
  //   return {
  //     ...state,
  //     loading: false,
  //   }
  // },
  [GARDENUSER_TYPE_REQUEST]: (state, action) => {
    return {
      ...state,
      typeState: {
        ...state.typeState,
        loading: true,
      },
    }
  },
  [GARDENUSER_TYPE_SUCCESS]: (state, action) => {
    return {
      ...state,
      typeState: {
        ...state.typeState,
        loading: false,
        data: action.payload.dicts,
      },
    }
  },
  [GARDENUSER_TYPE_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      typeState: {
        ...state.typeState,
        loading: false,
      },
    }
  },
  [GARDENUSER_CHANGE_SEARCH]: (state, action) => {
    return {
      ...state,
      searchParams: {
        ...state.searchParams,
        ...action.payload,
      },
    }
  },
  [GARDENUSER_GARDEN_REQUEST]: (state, action) => {
    return {
      ...state,
      garden: {
        ...state.garden,
        loading: true,
      },
    }
  },
  [GARDENUSER_GARDEN_SUCCESS]: (state, action) => {
    const {
      pageNo,
      pageSize,
      count,
    } = action.data
    return {
      ...state,
      garden: {
        ...state.garden,
        loading: false,
        data: [...state.garden.data, ...action.data.list],
        pageNo,
        pageSize,
        count,
      },
    }
  },
  [GARDENUSER_GARDEN_FAILURE]: (state, action) => {
    return {
      ...state,
      garden: {
        ...state.garden,
        loading: false,
      },
    }
  },
  [GARDENUSER_ROLE_REQUEST]: (state, action) => {
    return {
      ...state,
      roleState: {
        ...state.roleState,
        loading: true,
      },
    }
  },
  [GARDENUSER_ROLE_SUCCESS]: (state, action) => {
    let newState = {
      ...state,
      roleState: {
        ...state.roleState,
        loading: false,
        data: action.payload,
      },
    }
    let roleField = newState.formFields.find((item) => {
      return item.name === 'roleId'
    })
    roleField.state = newState.roleState
    let roleEditField = newState.formEditFields.find((item) => {
      return item.name === 'roleId'
    })
    roleEditField.state = newState.roleState
    return newState
  },
  [GARDENUSER_ROLE_FAILURE]: (state, action) => {
    return {
      ...state,
      roleState: {
        ...state.roleState,
        loading: false,
      },
    }
  },
  [GARDENUSER_RESETPWD_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [GARDENUSER_RESETPWD_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      loading: false,
      newPwdText: action.payload,
    }
  },
  [GARDENUSER_RESETPWD_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      loading: false,
    }
  },
  [GARDENUSER_ACTIVE_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [GARDENUSER_ACTIVE_SUCCESS]: (state, action) => {
    message.success('操作成功')
    return {
      ...state,
      loading: false,
    }
  },
  [GARDENUSER_ACTIVE_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      loading: false,
    }
  },
  [GARDENUSER_DETAIL_REQUEST]: (state, action) => {
    return {
      ...state,
      loading: true,
    }
  },
  [GARDENUSER_DETAIL_SUCCESS]: (state, action) => {
    return {
      ...state,
      record: {
        ...state.record,
        address: action.payload.garden
          ? action.payload.garden.area.name + ' ' + action.payload.garden.addressDetail
          : '',
      },
      loading: false,
    }
  },
  [GARDENUSER_DETAIL_FAILURE]: (state, action) => {
    message.error(action.payload)
    return {
      ...state,
      loading: false,
    }
  },
  [GARDENUSER_CHANGE_RECORD]: (state, action) => {
    return {
      ...state,
      record: action.fields,
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
  isEdit: false,
  isMain: false,
  start: 0,
  page: {
    pageNo: 1,
    pageSize: 10,
    count: 0,
  },
  searchParams: {
  },
  typeState: {
    data: [],
    loading: false,
    lastFetch: 0,
  },

  gardenState: {
    data: [],
    loading: false,
    lastFetch: 0,
  },

  garden: {
    data: [],
    loading: false,
  },

  roleState: {
    data: [],
    loading: false,
    lastFetch: 0,
  },

  formFields: [{
    label: '所属园区',
    name: 'gardenId',
    required: true,
    simple: true,
    long: true,
    type: 'select',
    valueName: 'id',
    displayName: 'name',
  }, {
    label: '角色权限',
    name: 'roleId',
    required: true,
    long: true,
    simple: true,
    type: 'select',
    state: {
      data: [],
      loading: false,
      lastFetch: 0,
    },
    valueName: 'id',
    displayName: 'name',
  }, {
    label: '姓名',
    name: 'name',
    required: true,
    long: true,
    simple: true,
    max: 20,
  }, {
    label: '电话',
    name: 'phone',
    required: true,
    long: true,
    simple: true,
    phone: true,
  }, {
    label: '账号',
    name: 'loginName',
    required: true,
    long: true,
    simple: true,
    max: 50,
  }, {
    label: '默认初始密码',
    name: 'pwd',
    long: true,
    simple: true,
    initialValue: '123456',
    disabled: true,
  }],

  formEditFields: [{
    label: '所属园区',
    name: 'gardenId', // add fields unused for edit, but it validate!
    hidden: true,
    simple: true,
    long: true,
  }, {
    label: '所属园区',
    name: 'officeName',
    disabled: true,
    simple: true,
  }, {
    label: '角色权限',
    name: 'roleId',
    required: true,
    long: true,
    simple: true,
    type: 'select',
    state: {
      data: [],
      loading: false,
      lastFetch: 0,
    },
    valueName: 'id',
    displayName: 'name',
  }, {
    label: '姓名',
    name: 'name',
    required: true,
    long: true,
    simple: true,
    max: 20,
  }, {
    label: '电话',
    name: 'phone',
    required: true,
    long: true,
    simple: true,
    phone: true,
  }, {
    label: '账号',
    name: 'loginName',
    required: true,
    long: true,
    disabled: true,
    simple: true,
    max: 50,
  }],
  formMainFields: [{
    label: '所属园区',
    name: 'gardenId', // add fields unused for edit, but it validate!
    hidden: true,
    long: true,
    simple: true,
  }, {
    label: '所属园区',
    name: 'officeName',
    disabled: true,
    long: true,
    simple: true,
  }, {
    label: '园区地址',
    name: 'address',
    type: 'textarea',
    disabled: true,
    long: true,
    simple: true,
  }, {
    hidden: true,
    label: '角色权限',
    name: 'roleId',
    required: true,
    long: true,
    simple: true,
    type: 'select',
    state: {
      data: [],
      loading: false,
      lastFetch: 0,
    },
    valueName: 'id',
    displayName: 'name',
  }, {
    label: '姓名',
    name: 'name',
    required: true,
    long: true,
    simple: true,
    max: 20,
  }, {
    label: '电话',
    name: 'phone',
    required: true,
    long: true,
    phone: true,
    simple: true,
  }, {
    label: '账号',
    name: 'loginName',
    required: true,
    long: true,
    disabled: true,
    simple: true,
    max: 50,
  }],
  record: {},
}
export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
