/**
 * 最终的Reducer，合并多个Reducer
 * Created by wein
 */

import { combineReducers } from 'redux'
import customListReducer from './custom/customListReducer'

// 开始合并Reducer，不管是只有一个还是多个reducer都要走这个套路
const appReducer = combineReducers({
    //userinfo: userinfo   注意es6 允许省略直接写userinfo即可，但我们这里不会同名
    customListAAA: customListReducer
})

export default appReducer


