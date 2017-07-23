import React, { Component } from 'react'
import { AutoComplete, Input, Button } from 'antd'
import PropTypes from 'prop-types'

export default class CommonInput extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    // value: PropTypes.string,
    disabled: PropTypes.bool,
    buttonText: PropTypes.string,
    buttonClick: PropTypes.func,
  }

  constructor (props) {
    super(props)
    let value = props.value || undefined
    if (typeof value === 'number') {
      value = '' + value
    }
    this.state = { value: value }
  }

  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      let value = nextProps.value || undefined
      if (typeof value === 'number') {
        value = '' + value
      }
      this.setState({ value: value })
    }
  }

  handleChange (value) {
    this.props.onChange(value)
  }

  render () {
    const {
      disabled,
      buttonText,
      buttonClick,
    } = this.props

    return (
      <AutoComplete
        {...this.props}
        value={this.state.value}
        children={<Input title={disabled ? this.state.value : ''} />}
        onChange={::this.handleChange}>
        {
          buttonText &&
          <Input
            suffix={(
              <Button type="secondary" onClick={buttonClick}>
                {buttonText}
              </Button>
            )}
          />
        }
      </AutoComplete>
    )
  }
}
