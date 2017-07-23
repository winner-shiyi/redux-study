import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import SendForm from '../SendForm'
// import GetForm from '../ModalForm'

export default class FormPage extends Component {
  render () {
    const {
      loading = false,
      fields = [],
    } = this.props
    return (
      <div style={{ padding: 16, flex: '0 0 auto'}}>
        {/*<Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <h2 className="ant-page-title">
              发货信息
            </h2>
          </Col>
        </Row>*/}
        
        <SendForm 
          fields={fields}
        />
      </div>
    )
  }
}