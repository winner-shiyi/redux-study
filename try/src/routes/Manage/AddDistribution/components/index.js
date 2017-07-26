import React, { Component } from 'react'
import FormPage from '../../../../components/FormPage'

class View extends Component {

  componentDidMount () {
    this.props.hello()
  }

  render () {
    const {
      activeFormField,
      permission,
      record,
      garden,
      gardenSearch,
      isEdit,
      changeRecord,
    } = this.props
    return (
      <FormPage 
        {...this.props}
      />
    )
  }
}

export default View
