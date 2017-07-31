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
    const map1 = new window.AMap.Map("mapContainessrSender", {
      resizeEnable: true
    })
    window.AMap.service(["AMap.PlaceSearch"], () => {
      this.placeSearch = new window.AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map: map1
      })
      // 关键字查询
      this.placeSearch.search('')
    })
  }


  render () {
    const {
      values,
      changeSenderMap,
    } = this.props

    let val1Arr = values.region.value
    let val2 = values.addressDetail.value
    
    if (val1Arr && val2 && this.placeSearch && this.placeSearch.search) {
      this.placeSearch.search(val1Arr.join(',') + val2, (status, result) => {
        if (result.poiList) {
          const pois = result.poiList.pois[0]
          window['mapInfosToWindow'] = {
            adcode: pois.adcode,
            latitude: pois.location.lat,
            longitude: pois.location.lng,
          }
        }
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
