// 关乎逻辑，涉及到 从redux获取state，使用connect方法生成出来
import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let inputDOM

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!inputDOM.value.trim()) {
          return
        }
        dispatch(addTodo(inputDOM.value)) // 分发派遣给action中的addTodo
        inputDOM.value = ''
      }}>
        <input ref={node => { // 获取到输入框真实DOM节点
          inputDOM = node
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
