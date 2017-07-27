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

const FormItem = Form.Item

class SendForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      expand: document.body.clientWidth > 768,
    }

    this.responsiveHandler = ((e) => {
      if (e.matches) {
        this.setState({
          expand: false,
        })
      } else {
        this.setState({
          expand: true,
        })
      }
    }).bind(this)
  }

  componentDidMount () {
    var map1 = new AMap.Map("mapContainessrSender", {
        resizeEnable: true
    })
    var map2 = new AMap.Map("mapContainessrGet", {
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
    const {
      expand,
    } = this.state
  
    const childrenSend = []
    const childrenGet = []
    const len = fields.send.length || 0
    const len2 = fields.get.length || 0
    let labelCol = expand ? 7 : 4
    let wrapperCol = expand ? 17 : 20
    for (let i = 0; i < len; i++) {
      childrenSend.push(
        createFormItem({
          field: fields.send[i],
          form: this.props.form,
          formItemLayout: {
            labelCol: { span:6 },
            wrapperCol: { span: 18 },
          },
          inputOpts: {},
          colSpan: 12,
        })
      )
    }

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
          colSpan: 8,
        })
      )
    }

    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="ant-advanced-search-form">
        <Row>
          <Col>
            <h2 className="ant-page-title">
              发货信息
            </h2>
          </Col>
        </Row>
        <Row gutter={20}>
          {childrenSend}
        </Row>
        <Row>
          <Col><div id="mapContainessrSender"></div></Col>
        </Row>
        <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <h2 className="ant-page-title">
              收货信息
            </h2>
          </Col>
          <Col><Button type="primary">添加收货地址</Button></Col>
        </Row>
        <Row>
          {childrenGet}
        </Row>
        <Row>
          <Col><div id="mapContainessrGet"></div></Col>
        </Row>
        <FormItem wrapperCol={{ span: 17, offset: 7 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="login-form-button" 
            loading={this.props.loading}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedSendForm = Form.create()(SendForm);

export default WrappedSendForm
