import fetch from '../../../util/fetch'
import { Message } from 'antd'
// ------------------------------------
// Constants
// ------------------------------------
const FINDPWD_LOGIN = 'FINDPWD_LOGIN'
const FINDPWD_CODE_REQUEST = 'FINDPWD_CODE_REQUEST'
const FINDPWD_CODE_SUCCESS = 'FINDPWD_CODE_SUCCESS'
const FINDPWD_CODE_FAILURE = 'FINDPWD_CODE_FAILURE'
const FINDPWD_VERIFY_REQUEST = 'FINDPWD_VERIFY_REQUEST'
const FINDPWD_VERIFY_SUCCESS = 'FINDPWD_VERIFY_SUCCESS'
const FINDPWD_VERIFY_FAILURE = 'FINDPWD_VERIFY_FAILURE'
const FINDPWD_SET_REQUEST = 'FINDPWD_SET_REQUEST'
const FINDPWD_SET_SUCCESS = 'FINDPWD_SET_SUCCESS'
const FINDPWD_SET_FAILURE = 'FINDPWD_SET_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
const verifyRequest = (params) => {
  return {
    type: FINDPWD_VERIFY_REQUEST,
    payload: params,
  }
}

const verifySuccess = (data) => {
  return {
    type: FINDPWD_VERIFY_SUCCESS,
    payload: data,
  }
}

const verifyFailure = (msg) => {
  return {
    type: FINDPWD_VERIFY_FAILURE,
    payload: msg,
  }
}

const verify = (params) => {
  return dispatch => {
    dispatch(verifyRequest(params))
    return fetch('/verifyIdentity', params)
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(verifySuccess(json.resultData))
          return true
        } else {
          dispatch(verifyFailure(json.resultDesc))
          return false
        }
      })
  }
}

const setRequest = (params) => {
  return {
    type: FINDPWD_SET_REQUEST,
    payload: params,
  }
}

const setSuccess = (data) => {
  return {
    type: FINDPWD_SET_SUCCESS,
    payload: data,
  }
}

const setFailure = (msg) => {
  return {
    type: FINDPWD_SET_FAILURE,
    payload: msg,
  }
}

const set = (params) => {
  return dispatch => {
    dispatch(setRequest(params))
    return fetch('/findPwd', params)
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(setSuccess(json.resultData))
          return true
        } else {
          dispatch(setFailure(json.resultDesc))
          return false
        }
      })
  }
}

const login = (current) => {
  return {
    type: FINDPWD_LOGIN,
    current,
  }
}

const codeRequest = (params) => {
  return {
    type: FINDPWD_CODE_REQUEST,
    payload: params,
  }
}

const codeSuccess = (data) => {
  return {
    type: FINDPWD_CODE_SUCCESS,
    payload: data,
  }
}

const codeFailure = (msg) => {
  return {
    type: FINDPWD_CODE_FAILURE,
    payload: msg,
  }
}

const code = (params) => {
  return dispatch => {
    dispatch(codeRequest(params))
    return fetch('/sendCode', params)
      .then(json => {
        if (json.resultCode == '0000') {
          dispatch(codeSuccess(json.resultData))
          return true
        } else {
          dispatch(codeFailure(json.resultDesc))
          return false
        }
      })
  }
}

export const actions = {
  verify,
  set,
  login,
  code,
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [FINDPWD_LOGIN]: (state, action) => {
    return {
      ...state,
      current: action.current,
    }
  },
  [FINDPWD_CODE_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [FINDPWD_CODE_SUCCESS]: (state, action) => {
    return {
      ...state,
    }
  },
  [FINDPWD_CODE_FAILURE]: (state, action) => {
    Message.error(action.payload)
    return {
      ...state,
    }
  },
  [FINDPWD_VERIFY_REQUEST]: (state, action) => {
    return {
      ...state,
      verifyLoading: true,
    }
  },
  [FINDPWD_VERIFY_SUCCESS]: (state, action) => {
    return {
      ...state,
      verifyLoading: false,
      identity: action.payload.identity,
      current: 1,
    }
  },
  [FINDPWD_VERIFY_FAILURE]: (state, action) => {
    Message.error(action.payload)
    return {
      ...state,
      verifyLoading: false,
    }
  },
  [FINDPWD_SET_REQUEST]: (state, action) => {
    return {
      ...state,
      setLoading: true,
    }
  },
  [FINDPWD_SET_SUCCESS]: (state, action) => {
    return {
      ...state,
      setLoading: false,
      current: 2,
    }
  },
  [FINDPWD_SET_FAILURE]: (state, action) => {
    Message.error(action.payload)
    return {
      ...state,
      setLoading: false,
    }
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  current: 0,
  identity: '',
  verifyLoading: false,
  setLoading: false,
}
export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
