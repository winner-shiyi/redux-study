import React, { Component }  from 'react'
import { Form,
  Row,
  Col,
  Button,
  Icon } from 'antd';
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'

import { fields } from '../../../public/mock/fields'
import './SendForm.scss'

const FormItem = Form.Item;

class SendForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  componentDidMount () {
    var map = new AMap.Map("mapContainessr", {
        resizeEnable: true
    })
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 1,
          pageIndex: 1,
          //city: "010", //城市
          map: map
        });
        //关键字查询
        placeSearch.search('杭州市近江时代大厦', function(status, result) {
          console.log(status)
          console.log(result)
        })
    })
  }

  render() {
    // const {
    //   fields,
    // } = this.props
  
    const childrenSend = []
    const childrenGet = []
    const len = fields.send.length || 0
    const len2 = fields.get.length || 0
    for (let i = 0; i < len; i++) {
      childrenSend.push(
        createFormItem({
          field: fields.send[i],
          form: this.props.form,
          formItemLayout: {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
          },
          inputOpts: {},
          colSpan: 24,
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
          colSpan: 24,
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
        <Row gutter={20}>
          <div id="mapContainessr"></div>
        </Row>
        <Row gutter={20}>
          <Col>
            <h2 className="ant-page-title">
              收货信息
            </h2>
          </Col>
        </Row>
        <Row gutter={20}>
          {childrenGet}
        </Row>
      </Form>
    )
  }
}

const WrappedSendForm = Form.create()(SendForm);

export default WrappedSendForm
