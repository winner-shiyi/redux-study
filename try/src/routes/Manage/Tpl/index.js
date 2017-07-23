import { injectReducer } from '../../../store/reducers.js'
import { common } from '../../../store/common'

export const moduleName = 'Tpl'

export default (store) => ({
  path : moduleName,
  onEnter: ({ location, routes, params }, replace, next) => {
    store.dispatch(common.initialMenu())
    next()
  },
  onLeave: () => {
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const propertyContainer = require('./containers').default
      const reducer = require('./modules').default

      injectReducer(store, { key: moduleName, reducer })

      cb(null, propertyContainer)

    })
  },
})
