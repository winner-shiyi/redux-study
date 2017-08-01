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
  constructor (props) {
    super(props)
    this.state = {
      dataSource: [],
    }
    this.timer = null
  }

  componentDidMount () {
    const map1 = new window.AMap.Map('mapContainessrSender', {
      resizeEnable: true,
    })
    window.AMap.service(['AMap.PlaceSearch'], () => {
      this.placeSearch = new window.AMap.PlaceSearch({ // 构造地点查询类
        pageSize: 1,
        pageIndex: 1,
        map: map1,
      })
      // 关键字查询
      this.placeSearch.search('')
    })
  }
  /**
   * 监听输入值变化 
   * val 表示用户输入的商家名称
   */
  onChange = (val) => { // 使用箭头函数,让this指向sendForm组件,否则这个thi指向的是fields[0]
    // console.log('我是onChange输出的值：' + val)
    // 请求接口 过1秒钟以后去请求接口
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.senderSearch(val).then((items) => {
        const newDataSource = items.map((item) => item.shopName)
        this.renderItem(newDataSource, val)
      })
    }, 400)
  }

  renderItem = (newDataSource, val) => {
    this.setState({
      dataSource: newDataSource,
    })

    const {
      newSenderInfos, // redux中保存的 模糊搜索接口返回的发货信息数组
      values,
    } = this.props

    const shopName = val
    let shopItem = newSenderInfos.find((item) => {
      return item.shopName === shopName
    })

    shopItem = shopItem || {}

    values.userName.value = shopItem.userName
    values.phone.value = shopItem.phone
    values.region.value = [shopItem.province, shopItem.city, shopItem.area]
    values.addressDetail.value = shopItem.addressDetail

    this.props.changeRecord(values)
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
    
    // 下面是绑定发货商家名称这个表单的onChange事件
    fields[0].onChange = this.onChange
    fields[0].dataSource = this.state.dataSource

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

// 路由跳转
// goDispatch() {
//   browserHistory.push('/Manage/ChooseDriver/' + this.props.paramsId);
// }
