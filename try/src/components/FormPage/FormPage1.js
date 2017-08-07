import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Icon } from 'antd'
import { Link, browserHistory } from 'react-router'
import SendForm from '../SendForm'
import ReceiverForm from '../ReceiverForm'

const FormItem = Form.Item

class FormPage extends Component {

  /**
   * 添加收货地址
   */
  add () {
    this.props.addReceiverInfo()
  }
  /**
   * 提交表单
   */
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 需要转换成 { from: {}, to: [{}, {}] }这种格式
        const senderInfo = {}
        const receiversInfoList = []
        const receiversInfoListObj = {}

        Object.keys(values).forEach((key) => {
          let k = parseInt(key)
          const curValue = values[key]

          if (isNaN(k)) {
            senderInfo[key] = curValue
            if (key === 'region') {
              senderInfo['province'] = senderInfo[key][0]
              senderInfo['city'] = senderInfo[key][1]
              senderInfo['area'] = senderInfo[key][2]
            }
            Object.assign(senderInfo, window.mapInfosToWindow)
            delete senderInfo.region
            if (key === 'drivingTime') {
              senderInfo[key] = new Date(senderInfo[key]).getTime() // 转换成毫秒数
            }
          } else {
            if (!receiversInfoListObj[k]) {
              receiversInfoListObj[k] = {}
            }
            receiversInfoListObj[k][key.replace(k, '')] = curValue
            // 把省市区数组转成 对应字符串
            if (key.replace(k, '') === 'region') {
              receiversInfoListObj[k]['province'] = values[key][0]
              receiversInfoListObj[k]['city'] = values[key][1]
              receiversInfoListObj[k]['area'] = values[key][2]
            }
            // 从window上获取地图保存信息
            const mw = window[`${k}mapInfosToWindow`] 
            Object.assign(receiversInfoListObj[k], mw)
            delete receiversInfoListObj[k].region 
            if (key.replace(k, '') === 'deliveryBeginTime') {
              receiversInfoListObj[k]['deliveryBeginTime'] = new Date(receiversInfoListObj[k]['deliveryBeginTime']).getTime()
            }
            if (key.replace(k, '') === 'deliveryEndTime') {
              receiversInfoListObj[k]['deliveryEndTime'] = new Date(receiversInfoListObj[k]['deliveryEndTime']).getTime()
            }                   
          }
        })
        Object.keys(receiversInfoListObj).forEach((key) => {
          receiversInfoList.push(receiversInfoListObj[key])
        })

        this.props.submit({
          senderInfo,
          receiversInfoList,
        }).then((isSuccess) => {
          isSuccess && this.handleGo() // 跳转到列表页 ？？还要去请求列表页的接口吗
        })
      }
    })
  }

  handleGo = () => {
    browserHistory.push('/Manage/Distribution')
  }

  render () {
    const {
      loading = false,
      form,
      receiverFormNo,
      receiverFields,
      reduceReceiverInfo,
      values, // 就是保存表单中填写的数据,
      changeSenderMap,
      changeReceiverMap,
      senderSearch,
      newSenderInfos,
      changeRecord,
    } = this.props
    return (
      <div style={{ padding: 16, flex: '1 1 auto' }}>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <h2 className="ant-page-title">
                发货信息
              </h2>
            </Col>
          </Row>
          
          <SendForm form={form} 
            values={values} 
            changeRecord={changeRecord}
            senderSearch={senderSearch} 
            newSenderInfos={newSenderInfos}
          />
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
                  values={values}
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
const WrappedFormPage = Form.create({
  mapPropsToFields (props) {
    let res = {}
    for (let i in props.values) { // props.values 拿到的就是上面传下来的【保存填写的表单数据】
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
    // console.log('fields为：'+ JSON.stringify(fields) )

    for (let v in fields) {
      let fld = null
      props.receiverFields && props.receiverFields.forEach((receiverField) => {
        fld = receiverField.fields.find((item) => item.name === fields[v].name)
      })
      // console.log(fld)
      fields[v].type = fld && fld.type
    }
    props.changeRecord && props.changeRecord({ // 从上面拿到的【表单数据更新的函数】
      ...props.values,
      ...fields,
    })
  },
})(FormPage)
export default WrappedFormPage

