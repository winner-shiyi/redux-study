import React, { Component } from 'react'
import { Form,
  Row,
  Col,
  Button,
  Icon } from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'

import { fields } from './configFields' // 新建车配任务表单字段
import './ReceiversForm.scss'

const FormItem = Form.Item

export default class ReceiversForm extends Component {
  
  componentDidMount () {
    var map2 = new AMap.Map("mapContainessrGet", {
        resizeEnable: true
    })
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 1,
          pageIndex: 1,
          // city: "010", //城市
          map: map2
        })
        // 关键字查询
        placeSearch.search('杭州市三新家园', function(status, result) {
          // console.log(status)
          // console.log(result)
        })
    })
    
  }

  render () {
    // const {
    //   fields,
    // } = this.props
  
    const childrenGet = []
    const len2 = fields.get.length || 0
    for (let i = 0; i < len2; i++) {
      childrenGet.push(
        createFormItem({
          field: fields.get[i],
          form: this.props.form,
          formItemLayout: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          },
          inputOpts: {},
          colSpan: 12,
        })
      )
    }
    // const { getFieldDecorator } = this.props.form
    return (
      <div>
        { childrenGet }
        <Row>
          <Col><div id="mapContainessrGet"></div></Col>
        </Row>
      </div>
     
    )
  }
}
