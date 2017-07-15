import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'
// 和逻辑无关，纯展示的组件
const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo} // es6的语法糖，表示todo中剩下的props，比如compeleted：true
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)



TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList
