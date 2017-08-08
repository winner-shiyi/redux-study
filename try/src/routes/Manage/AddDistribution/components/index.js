import React, { Component } from 'react'
import WrappedFormPage from '../../../../components/FormPage'

class View extends Component {

  render () {
    const {
      record, // 保存填写的表单数据
      route, // 路由
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
