import React, { Component } from 'react'
import WrappedFormPage from '../../../../components/FormPage'

class View extends Component {

  componentDidMount () {
    this.props.hello()
  }

  render () {
    const {
      receiverFields,
      changeRecord,
      addReceiverInfo,
    } = this.props
    return (
      <WrappedFormPage 
        {...this.props}
      />
    )
  }
}

export default View
