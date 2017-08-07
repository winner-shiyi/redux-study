import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Button,
  Icon
} from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'
import './ReceiverForm.scss'

export default class ReceiverForm extends Component {
  constructor (props) {
    super(props)
    this.AmapId = 'mapId' + Math.random()  
  }

  componentDidMount () { 
    const map = new window.AMap.Map(this.AmapId, {
      resizeEnable: true,
    })
    window.AMap.service(['AMap.PlaceSearch'], () => {
      this.placeSearch = new window.AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map: map,
      })
      // 关键字查询
      this.placeSearch.search('')
    })
  }

  /**
   * 删除收货地址
   * @param id 收货地址的id
   */
  
  reduce (id) {
    this.props.reduceReceiverInfo(id)
  }

  render() {
    const {
      fields,
      length,
      id,
      form,
      values,
    } = this.props

    let val1Arr = values && values[`${id}region`] && values[`${id}region`].value
    let val2 = values && values[`${id}addressDetail`] && values[`${id}addressDetail`].value

    if (val1Arr && val2 && this.placeSearch && this.placeSearch.search) {
      this.placeSearch.search(val1Arr.join(',') + val2, (status, result) => {
        if (result.poiList) {
          const pois = result.poiList.pois[0]
          window[`${id}mapInfosToWindow`] = {
            adcode: pois.adcode,
            latitude: pois.location.lat,
            longitude: pois.location.lng,
          }
        }
      })
    }

    return (
      <li className="receiverForm-item-box" data-id={id}>
        {
          Number(length) > 1 &&
          <Icon type="close-circle" className="close-circle" onClick={this.reduce.bind(this, id)} />
        }
        <Row>
          {
            fields.map((item) => {
              return (
                createFormItem({
                  field: item,
                  form: this.props.form,
                  formItemLayout: {
                    labelCol: { span: 6 },
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
          <Col><div id={this.AmapId} className="mapContainessr"></div></Col>
        </Row>
      </li>

    )
  }
}
