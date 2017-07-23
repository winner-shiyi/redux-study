import { Message } from 'antd'
import fetch from '../util/fetch'
// ------------------------------------
// Constants
// ------------------------------------
const DICT_REQUEST = 'DICT_REQUEST'
const DICT_SUCCESS = 'DICT_SUCCESS'
const DICT_FAILURE = 'DICT_FAILURE'
// ------------------------------------
// Actions
// ------------------------------------
const dictRequest = (type) => {
  return {
    type: 'DICT_REQUEST',
    payload: type,
  }
}

const dictSuccess = (data, type) => {
  return {
    type: 'DICT_SUCCESS',
    payload: data,
    dictType: type,
  }
}

const dictFailure = (msg) => {
  return {
    type: 'DICT_FAILURE',
    payload: msg,
  }
}

export const dict = (type) => {
  return (dispatch, getState) => {
    dispatch(dictRequest(type))
    const dictCache = getState().dict
    return new Promise((resolve, reject) => {
      if (dictCache[type]) {
        dispatch(dictSuccess(dictCache[type], type))
        resolve(dictCache[type])
      } else {
        fetch('/dict/list', {
          type: type,
        })
          .then(json => {
            if (json.resultCode === '0000') {
              dispatch(dictSuccess(json.resultData, type))
              resolve(json.resultData.dicts)
            } else {
              dispatch(dictFailure(json.resultDesc))
              reject(json.resultDesc)
            }
          })
      }
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------

const ACTION_HANDLERS = {
  [DICT_REQUEST]: (state, action) => {
    return {
      ...state,
    }
  },
  [DICT_SUCCESS]: (state, action) => {
    let newState = {
      ...state,
    }

    newState[action.dictType] = action.payload.dicts
    return newState
  },
  [DICT_FAILURE]: (state, action) => {
    Message.error(action.payload)
    let newState = {
      ...state,
    }
    return newState
  },
}

const initialState = {
}
export default function dictReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
