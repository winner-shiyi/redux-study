import React, { Component } from 'react'

class View extends Component {

  componentDidMount () {
    this.props.hello()
  }

  render () {
    return (
      <div>车配任务明细</div>
    )
  }
}

export default View
