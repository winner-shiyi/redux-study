// 关乎逻辑，涉及到 从redux获取state，使用connect方法生成出来
import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(addTodo(input.value))// 分发派遣给 action中的addTodo
        input.value = ''
      }}>
        <input ref={node => { // 获取到输入框真实DOM节点
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
// 从redux获取state，使用connect方法生成出来
AddTodo = connect()(AddTodo)

export default AddTodo
