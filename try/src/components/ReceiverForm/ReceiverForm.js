import React, { Component } from 'react'
import { Form,
  Row,
  Col,
  Button,
  Icon } from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'

// import { fields } from './configFields' // 新建车配任务表单字段
import './ReceiverForm.scss'

export default class ReceiverForm extends Component {
  
  componentDidMount () {
    var map2 = new AMap.Map("mapContainessrGet0", {
        resizeEnable: true
    })
    AMap.service(["AMap.PlaceSearch"], function() {
        var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 1,
          pageIndex: 1,
          // city: "010", //城市
          map: map2
        })
        // 关键字查询
        placeSearch.search('杭州市三新家园', function(status, result) {
          // console.log(status)
          // console.log(result)
        })
    })
    
  }

  render () {
    const {
      AmapId,
      fields,
    } = this.props
    console.log(AmapId)
  
    return (
      <li>
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
          <Col><div id={AmapId} className="mapContainessr"></div></Col>
        </Row>
      </li>
     
    )
  }
}
