import React from 'react'
import {
  Form,
  Input,
  Modal,
  Row,
  Button,
} from 'antd'
import { createFormItem } from '../../components'
import { Scrollbars } from 'react-custom-scrollbars'

const FormItem = Form.Item

const ModalForm = Form.create({
  mapPropsToFields (props) {
    const res = {}
    for (let i in props.values) {
      let param = props.values[i]
      if (typeof param === 'object' && !(param instanceof Array)) {
        res[i] = param
      } else {
        res[i] = { value: param }
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
})(
  (props) => {
    const {
      visible,
      onCancel,
      onCreate,
      title,
      fields,
      form,
      formWidth,
      cusTitle,
      confirmLoading } = props
    const { getFieldDecorator, validateFields } = form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }

    const save = () => {
      validateFields({ force: true }, (err, values) => {
        if (!err) {
          onCreate(values)
        }
      })
    }

    const isEdit = () => {
      return !!(props.values && props.values.id)
    }

    const geneForm = (fields) => {
      return (
        <Scrollbars
          autoHeight
          autoHeightMin={100}
          autoHeightMax={550}>
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
          </Form>
        </Scrollbars>
      )
    }

    return (
      <Modal
        width={formWidth || 1000}
        visible={visible}
        title={cusTitle || ((isEdit() ? '修改' : '新增') + title)}
        okText="保存"
        onCancel={onCancel}
        onOk={save}
        maskClosable={false}
        footer={[
          <Button key="submit" size="large" type="primary" onClick={save} loading={confirmLoading}>
            保存
          </Button>,
          <Button size="large" key="back" onClick={onCancel}>取消</Button>,
        ]}
      >
        {geneForm(fields)}
      </Modal>
    )
  }
)
export default ModalForm
