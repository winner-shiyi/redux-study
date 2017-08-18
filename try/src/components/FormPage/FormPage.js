import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message, Form, Row, Col, Button, Icon } from 'antd'
import { browserHistory } from 'react-router'
import SendForm from '../SendForm'
import ReceiverForm from '../ReceiverForm'
import './FormPage.scss'

const FormItem = Form.Item

class FormPage extends Component {
  static propTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool,
    newSenderInfos: PropTypes.array,
    receiverFields: PropTypes.array.isRequired,
    reduceReceiverInfo: PropTypes.func,
    senderSearch: PropTypes.func,
    changeRecord: PropTypes.func,
    form: PropTypes.object,
    values: PropTypes.object,
  }
  /**
   * 判断是否为空对象
   */
  isEmptyObject = (obj) => {
    for (var key in obj) {
      return false
    }
    return true
  } 
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
        // 需要转换成 { senderInfo: {}, receiversInfoList: [{}, {}] }这种格式提交
        const senderInfo = {}
        const receiversInfoList = []
        const receiversInfoListObj = {}
        let mw = {} // 存放收货信息的adcode 和 经纬度信息
        let timeCompareLock = true // 时间比较变量锁

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
            mw = window[`${k}mapInfosToWindow`] 
            Object.assign(receiversInfoListObj[k], mw)
            delete receiversInfoListObj[k].region 
            if (key.replace(k, '') === 'deliveryBeginTime') {
              receiversInfoListObj[k]['deliveryBeginTime'] = 
              new Date(receiversInfoListObj[k]['deliveryBeginTime']).getTime()
            }
            if (key.replace(k, '') === 'deliveryEndTime') {
              receiversInfoListObj[k]['deliveryEndTime'] = 
              new Date(receiversInfoListObj[k]['deliveryEndTime']).getTime()
            }
            
            if (receiversInfoListObj[k]['deliveryEndTime'] !== 0 &&  // 等于0的情况是，选择具体时间后又清空
              receiversInfoListObj[k]['deliveryEndTime'] < receiversInfoListObj[k]['deliveryBeginTime']) {
              timeCompareLock = false
            }                 
          }
        })
        Object.keys(receiversInfoListObj).forEach((key) => {
          receiversInfoList.push(receiversInfoListObj[key])
        })
        // 如果输入的是无效地址，弹窗提示并且return禁止提交表单
        if (this.isEmptyObject(window.mapInfosToWindow) || this.isEmptyObject(mw)) { 
          message.error('亲，请输入正确有效的地址哦~')
          return
        }
        // 送达起始时间不能大于结束时间
        if (!timeCompareLock) {
          message.error('送达起始时间不能大于送达结束时间哦~')
          return
        }
        this.props.submit({
          senderInfo,
          receiversInfoList,
        }).then((isSuccess) => {
          isSuccess && this.handleGo() // 跳转到列表页
        })
      }
    })
  }
  handleGo = () => {
    browserHistory.push('/Manage/Distribution')
  }

  render () {
    const {
      form,
      title,
      receiverFields,
      reduceReceiverInfo,
      values, // 就是保存表单中填写的数据,
      senderSearch,
      newSenderInfos,
      changeRecord,
    } = this.props
    return (
      <div style={{ padding: 16, flex: '1 1 auto' }}>
        {
          (title) &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
          </Row>
        }
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
              receiverFields.length && receiverFields.map((item, index) => {
                const AmapId = 'mapContainessrGet' + index
                return <ReceiverForm
                  form={form}
                  key={item.id}
                  id={item.id}
                  fields={item.fields}
                  AmapId={AmapId}
                  length={this.props.receiverFields.length}
                  reduceReceiverInfo={reduceReceiverInfo}
                  values={values}
                />
              })
            }
          </ul>
          <FormItem className="AddDistribution-btn-formItem">
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
      fields[v].type = fld && fld.type
    }
    props.changeRecord && props.changeRecord({ // 从上面拿到的【表单数据更新的函数】
      ...props.values,
      ...fields,
    })
  },
})(FormPage)
export default WrappedFormPage

