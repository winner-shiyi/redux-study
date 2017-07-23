// We only need to import the modules necessary for initial render
import Home from './Home'
import SignInRoute from './SignIn'
import FindPwdRoute from './FindPwd'
import ManageRoute from './Manage'


/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : null,
  indexRoute  : Home,
  onEnter: ({ location, routes, params }, replace, next) => {
    if (location.pathname === '/' && sessionStorage.getItem('accessToken')) {
      replace('/Manage') // TODO
    }
    if (location.pathname === '/' && !sessionStorage.getItem('accessToken')) {
      replace('/SignIn')
    }
    next()
  },
  onLeave: () => {
  },
  childRoutes : [
    SignInRoute(store),
    ManageRoute(store),
    FindPwdRoute(store),
    
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
