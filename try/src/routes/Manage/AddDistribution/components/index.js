import React, { Component } from 'react'
import WrappedFormPage from '../../../../components/FormPage'

class View extends Component {
  constructor (props) {
    super(props)
    this.timer = null
  }
  componentDidMount () {
    const id = this.props.params.id
    let values = this.props.record
    if (id) {
      // 填充edit请求返回的数据
      this.props.editOredr(id)

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('this.props.data', this.props.data) 
        const data = this.props.data
        values.shopName.value = data.shopName
        values.userName.value = data.userName
        values.phone.value = data.phone
        values.region.value = [data.province, data.city, data.area]
        values.addressDetail.value = data.addressDetail
      }, 400)
    }
  }

  render () {
    const {
      record, // 保存填写的表单数据
      params, 
      data,
    } = this.props
    return (
      <WrappedFormPage 
        {...this.props}
        title={params.id ? '编辑车配任务' : '新建车配任务'}
        values={record}
        data={data}
        params={params}
      />
    )
  }
}

export default View
