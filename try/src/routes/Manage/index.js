// We only need to import the modules necessary for initial render
import CoreLayout from '../../layouts/CoreLayout'
import Home from '../Home'
import WorkOrder from './WorkOrder'
import GardenUser from './GardenUser'
import Role from './Role'
import Distribution from './Distribution'
import AddDistribution from './AddDistribution'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/Manage',
  component   : CoreLayout,
  indexRoute  : Home,
  onEnter: ({ location, routes, params }, replace, next) => {
    next()
  },
  onLeave: () => {
  },
  childRoutes : [
    WorkOrder(store),
    GardenUser(store),
    Role(store),
    Distribution(store), // 车配任务管理
    AddDistribution(store), // 新增车配任务
  ],
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes