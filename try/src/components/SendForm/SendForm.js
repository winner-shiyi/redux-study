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

export default class SendForm extends Component {
  componentDidMount () {
    const map1 = new AMap.Map("mapContainessrSender", {
      resizeEnable: true
    })
    AMap.service(["AMap.PlaceSearch"], () => {
      this.placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map: map1
      })
      // 关键字查询
      this.placeSearch.search('', function (status, result) {
        // console.log(status)
        // console.log(result)
      })
    })
  }

  render () {
    // const {
    //   fields,
    // } = this.props
    let val1 = this.props.form.getFieldValue('region')
    let val2 = this.props.form.getFieldValue('addressDetail')

    let val3 = ''
    if (val1 && val2) {
      val3 = val1.join() + ',' + val2
    }
    if (this.placeSearch && this.placeSearch.search) {
      this.placeSearch.search(val3, (status, result) => {
        // console.log(result.poiList.pois[0].adcode && result.poiList.pois[0].adcode)
        // console.log(result.poiList.pois[0].location.lat)
        // console.log(result.poiList.pois[0].location.lng)
      })
    }

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
