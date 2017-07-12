import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'

// 是响应的抽象
// 一般也是由方法生成的
// 纯函数编程，不能在这里获取当前时间Date.now()，Math.random(),ajax的，纯方法表示：输出完全由输入决定的
// 传入旧状态和action
// 返回新状态
const todoApp = combineReducers({// 把多个reducer合在一起
  todos,
  visibilityFilter,
})

export default todoApp
