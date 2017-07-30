import React, { Component } from 'react'
import WrappedFormPage from '../../../../components/FormPage'
// import FormPage from '../../../../components/FormPage'
class View extends Component {

  componentDidMount () {
    this.props.hello()
  }

  render () {
    const {
      receiverFields,
      changeRecord, // 方法：表单数据更新的函数
      addReceiverInfo,
      reduceReceiverInfo,
      receiverFormNo,
      record, // 保存填写的表单数据
    } = this.props
    return (
      <WrappedFormPage 
        {...this.props}
        values={record}
      />
    )
  }
}

export default View
