import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => { // 对应第一种
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}


const mapStateToProps = (state) => { // 第一种：state转化成props，参数肯定是state
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
  
}

const mapDispatchToProps = (dispatch) => { // 第二种，dispatch是怎么影响props的，参数肯定是dispatch
  return {
    onTodoClick: (id) => { // onTodoClick 在TodoList组件中会定义，作为props传给TodoList
      dispatch(toggleTodo(id))
    }
  }
  
}
//从redux获取state，使用connect方法生成出来，这里可以先写
const VisibleTodoList = connect(
  // react 的props有两种可能，一种是state引起的props变化
  // 另外一种是用户(派发的某个行为)行为直接引起的props变化
  mapStateToProps,
  mapDispatchToProps
)(TodoList)// 括号后面参数表示：传给哪一个组件

export default VisibleTodoList
