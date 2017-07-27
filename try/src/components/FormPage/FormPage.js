import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'antd'
import SendForm from '../SendForm'
// import GetForm from '../ModalForm'

export default class FormPage extends Component {
  render () {
    const {
      loading = false,
    } = this.props
    return (
      <div style={{ padding: 16, flex: '1 1 auto' }}>
        
        <SendForm />
      </div>
    )
  }
}
