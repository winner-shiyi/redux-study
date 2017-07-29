import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon } from 'antd'
import SendForm from '../SendForm'
import ReceiverForm from '../ReceiverForm'

const FormItem = Form.Item

class FormPage extends Component {

  add () {
    this.props.addReceiverInfo()
  }
    
  render () {
    const {
      loading = false,
      form,
      receiverFormNo,
      receiverFields,
      reduceReceiverInfo,
    } = this.props
    return (
      <div style={{ padding: 16, flex: '1 1 auto' }}>
        <Form className="ant-advanced-search-form">
          <Row>
            <Col>
              <h2 className="ant-page-title">
                发货信息
              </h2>
            </Col>
          </Row>
          <SendForm form={form} />
          <Row>
            <Col>
              <h2 className="ant-page-title">
                收货信息
              </h2>
            </Col>
          </Row>
          <ul>
            {
              receiverFields.map((item, index) => {
                const AmapId = 'mapContainessrGet' + index
                return <ReceiverForm 
                  form={form} 
                  key={item.id}
                  id={item.id}
                  fields={item.fields}
                  AmapId={AmapId}
                  // receiverFormNo={receiverFormNo}
                  length={this.props.receiverFields.length}
                  reduceReceiverInfo={reduceReceiverInfo}
                />
              })
            }
          </ul>
          <FormItem wrapperCol={{ span: 17, offset: 7 }}>
            <Button type="dashed" onClick={this.add.bind(this)}>
              <Icon type="plus" /> 添加收货地址
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-form-button" 
              loading={this.props.loading}>提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const WrappedFormPage = Form.create()(FormPage)
export default WrappedFormPage

