import { message } from 'antd'
import { createAction } from '../../../../util'
import fetch from '../../../../util/fetch'

// ------------------------------------
// Constants
// ------------------------------------
const TPL_HELLO = 'TPL_HELLO'

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  hello: createAction(TPL_HELLO),
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TPL_HELLO]    : (state, action) => {
    message.info(state.helloText)
    let newState = {
      ...state,
    }
    return newState
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  helloText: 'I’m a mother father gentleman',
}

export default function reducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
