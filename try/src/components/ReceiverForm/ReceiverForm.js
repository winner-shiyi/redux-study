import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Button,
  Icon
} from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'

// import { fields } from './configFields' // 新建车配任务表单字段
import './ReceiverForm.scss'


export default class ReceiverForm extends Component {
  constructor(props) {
    super(props)
    this.AmapId = 'mapId' + Math.random()
  }

  componentDidMount() {
    const map = new AMap.Map(this.AmapId, {
      resizeEnable: true
    })
    AMap.service(["AMap.PlaceSearch"], () => {
      this.placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map: map
      })
      // 关键字查询
      this.placeSearch.search('杭州市三新家园', function (status, result) {
        // console.log(status)
        // console.log(result)
      })
    })
  }

  /**
   * 删除收货地址
   * @param id 收货地址的id
   */
  reduce(id) {
    this.props.reduceReceiverInfo(id)
  }

  render() {
    const {
      fields,
      length,
      id,
      form,
    } = this.props

    let obj = form.getFieldsValue([`receiverArea${id}`,`receiverAddressDetail${id}`])
    // console.log(form.getFieldsValue([`receiverArea${id}`,`receiverAddressDetail${id}`]))
  //  console.log(obj)

    return (
      <li className="receiverForm-item-box" data-id={id}>
        {
          Number(length) > 1 &&
          <Icon type="close-circle" className="close-circle" onClick={this.reduce.bind(this, id)} />
        }
        <Row>
          {
            fields.map((item) => {
              return (
                createFormItem({
                  field: item,
                  form: this.props.form,
                  formItemLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  },
                  inputOpts: {},
                  colSpan: 12,
                })
              )
            })
          }
        </Row>
        <Row>
          <Col><div id={this.AmapId} className="mapContainessr"></div></Col>
        </Row>
      </li>

    )
  }
}
