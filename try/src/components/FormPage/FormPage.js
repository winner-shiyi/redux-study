import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon } from 'antd'
import SendForm from '../SendForm'
import ReceiverForm from '../ReceiverForm'

const FormItem = Form.Item

const FormPage = Form.create({
  mapPropsToFields (props) {
    // console.log(props)
    
    let res = {}
    for (let i in props.values) {
      let param = props.values[i]
      if (typeof param === 'object' && 'value' in param) {
        res[i] = param
      } else {
        res[i] = { value: param }
      }
    }

    if (props.mapFields) {
      res = {
        ...res,
        ...props.mapFields(res),
      }
    }
    return res
  },
  onFieldsChange (props, fields) {
    // console.log(props)

    for (let v in fields) {
      let fld = null
      props.receiverFields &&　props.receiverFields.forEach((receiverField) => {
        fld = receiverField.fields.find((item) => item.name === fields[v].name)
      })

      // console.log(fld)

      fields[v].type = fld && fld.type
    }
    props.changeRecord && props.changeRecord({
      ...props.values,
      ...fields,
    })
  },
})(
  (props) => {
    const {
      loading = false,
      form,
      receiverFormNo,
      receiverFields,
      reduceReceiverInfo,
      addReceiverInfo,
      changeRecord,
    } = props

    /**
   * 添加收货地址
   */
    const add = () => {
      addReceiverInfo()
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      })
    }
    return (
      <div style={{ padding: 16, flex: '1 1 auto' }}>
        <Form className="ant-advanced-search-form" onSubmit={handleSubmit}>
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
                  length={receiverFields.length}
                  reduceReceiverInfo={reduceReceiverInfo}
                  changeRecord={changeRecord}
                />
              })
            }
          </ul>
          <FormItem wrapperCol={{ span: 17, offset: 7 }}>
            <Button type="dashed" onClick={add}>
              <Icon type="plus" /> 添加收货地址
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}>提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )


  }
)
export default FormPage

