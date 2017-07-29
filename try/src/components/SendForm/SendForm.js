import React, { Component } from 'react'
import { Form,
  Row,
  Col,
  Button,
  Icon } from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'

import { fields } from './configFields' // 新建车配任务表单字段

import './SendForm.scss'

// const FormItem = Form.Item

export default class SendForm extends Component {
  componentDidMount () {
     var map1 = new AMap.Map("mapContainessrSender", {
        resizeEnable: true
    })
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 1,
          pageIndex: 1,
          //city: "010", //城市
          map: map1
        })
        //关键字查询
        placeSearch.search('杭州市近江时代大厦', function(status, result) {
          // console.log(status)
          // console.log(result)
        })
    })
  }

  render () {
    // const {
    //   fields,
    // } = this.props
    return (
      <div className="senderForm-box">
        <Row>
          {
            fields.map((item) => {
              return (
                createFormItem({
                  field: item,
                  form: this.props.form,
                  formItemLayout: {
                    labelCol: { span:6 },
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
          <Col><div id="mapContainessrSender" className="mapContainessr"></div></Col>
        </Row>
      </div>
    )
  }
}
