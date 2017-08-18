import React, { Component } from 'react'
import { Row, Col, Icon } from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'
import './ReceiverForm.scss'

export default class ReceiverForm extends Component {
  static propTypes = {
    fields: PropTypes.array,
    values: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.AmapId = 'mapId' + Math.random()  
    this.timer1 = null
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
    this.mapChange()
  }
  /**
   * val1Arr拼接val2作为值传给高得地图api的公共函数
   */
  mapChange = () => {
    clearTimeout(this.timer1)
    this.timer1 = setTimeout(() => {
      let val1Arr = this.props.values[`${this.props.id}region`].value
      let val2 = this.props.values[`${this.props.id}addressDetail`].value

      this.placeSearch.search(`${val1Arr.join(',')},${val2}`, (status, result) => {
        if (result.info === 'OK' && result.poiList) {
          const pois = result.poiList.pois[0]
          window[`${this.props.id}mapInfosToWindow`] = {
            adcode: pois.adcode,
            latitude: pois.location.lat,
            longitude: pois.location.lng,
          }
        }
        if (status === 'no_data') {
          window[`${this.props.id}mapInfosToWindow`] = {}
        }
      })
    }, 400)
  }
  onRegionChange = () => {
    this.mapChange()
  }

  onAddressDetailChange = () => {
    this.mapChange()
  }

  /**
   * 删除收货地址
   * @param id 收货地址的id
   */
  
  reduce (id) {
    this.props.reduceReceiverInfo(id)
  }

  render () {
    const {
      fields,
      length,
      id,
    } = this.props

    // 以下是绑定收货信息表单的【收货地区】和【详细地址】onChange事件
    fields[4].onChange = this.onRegionChange
    fields[6].onChange = this.onAddressDetailChange

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
                    labelCol: { span: 4 },
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
