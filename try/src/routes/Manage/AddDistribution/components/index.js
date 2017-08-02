import React, { Component } from 'react'
import WrappedFormPage from '../../../../components/FormPage'
// import FormPage from '../../../../components/FormPage'
class View extends Component {

  componentDidMount () {
  }

  render () {
    const {
      receiverFields,
      changeRecord, // 方法：表单数据更新的函数
      addReceiverInfo,
      reduceReceiverInfo,
      receiverFormNo,
      record, // 保存填写的表单数据
      changeSenderMap, // 方法：发货信息地图更新
      senderMap, // 保存发货信息地图数据
      senderSearch,
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
