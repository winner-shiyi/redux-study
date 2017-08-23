import React, { Component } from 'react'
import WrappedFormPage from '../../../../components/FormPage'

class View extends Component {
  componentDidMount () {
    const { props } = this
    const id = props.params.id
    console.log(id)
  }

  render () {
    const {
      record, // 保存填写的表单数据
    } = this.props
    return (
      <WrappedFormPage 
        {...this.props}
        title="新建车配任务"
        values={record}
      />
    )
  }
}

export default View
