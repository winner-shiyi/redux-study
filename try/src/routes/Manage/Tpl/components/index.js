import React, { Component } from 'react'

class View extends Component {

  componentDidMount () {
    this.props.hello()
  }

  render () {
    return (
      <div>Template view</div>
    )
  }
}

export default View
