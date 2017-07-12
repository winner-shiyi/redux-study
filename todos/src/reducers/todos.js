
// 会影响到todo的 只有添加 和 切换完成状态，所以关于这两个action的响应行为统一写在这里
// 写reducer注意点：
// 是响应的抽象
// 一般也是由方法生成的
// 纯函数编程，不能在这里获取当前时间Date.now()，Math.random(),ajax的，纯方法表示：输出完全由输入决定的
// 传入旧状态prevState和action
// 返回新状态state
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      // return state.map(todo =>
      //   (todo.id === action.id) 
      //     ? {...todo, completed: !todo.completed}
      //     : todo
      // )
        return state.map(todo => {
          if(todo.id === action.id) {
            return {...todo, completed: !todo.completed}
          } else {
            return todo
          }
        })
    default:
      return state
  }
}

export default todos
