//是用户行为的抽象
// action 就是普通的js对象
// 一般由某个方法生成
// 必须有一个type

// 增加todo的用户行为
let nextTodoId = 0
export const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text,
  }
}
// 选择全部或者已完成或者未完成的todo 的用户行为
export const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter,
  }
  
}
// 切换todo完成状态的用户行为
export const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id,
  }
}
