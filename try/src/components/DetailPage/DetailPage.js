import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Spin } from 'antd'
import { createFormItem } from '../../components'

const FormItem = Form.Item

class DetailPage extends Component {

  static propTypes = {
  }

  render () {
    const {
      title,
      fields = [],
      form,
      loading = false,
      buttons = [],
      children = [],
    } = this.props

    const butt = buttons.map((item, index) => {
      return (!item.hidden) &&
        <Button
          style={item.style}
          key={`button${index}`}
          type={item.type || `primary`}
          onClick={(item['handleForm'] || item['onClick']).bind(this, form)}
          disabled={item.disabled}
          loading={item.loading}
        >
          { item.label }
        </Button>
    })

    const formItemLayout = ({
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    })

    const { getFieldDecorator } = form

    const geneForm = (fields) => {
      return (
        <Spin spinning={loading}>
          <Form layout="horizontal">
            <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
              {getFieldDecorator('id', {
              })(
                <Input type="hidden" />
              )}
            </FormItem>
            <Row>
              {
                fields.map((item) => {
                  return (
                    createFormItem({
                      field: item,
                      form,
                      formItemLayout,
                      inputOpts: {
                      },
                    })
                  )
                })
              }
            </Row>
            <FormItem style={{ textAlign: 'center' }}>
              { butt }
            </FormItem>
          </Form>
        </Spin>
      )
    }
    return (
      <div className="layout-content-detail">
        {
          title &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: 16 }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
          </Row>
        }
        {geneForm(fields)}
        {
          children
        }
      </div>
    )
  }
}

export default Form.create({
  mapPropsToFields (props) {
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
    for (let v in fields) {
      const fld = props.fields.find(item => item.name === fields[v].name)
      fields[v].type = fld && fld.type
    }
    props.changeRecord && props.changeRecord({
      ...props.values,
      ...fields,
    })
  },
})(DetailPage)

