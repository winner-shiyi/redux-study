import React, { Component } from 'react'

class View extends Component {

  componentDidMount () {
    this.props.hello()
  }

  render () {
    return (
      <div>派单页面</div>
    )
  }
}

export default View
