import React, { Component } from 'react'
import { Upload, Modal, Icon, Row, Col, Button, Spin, message } from 'antd'
import './style.scss'
import { getBaseUrl } from '../../util'
import PropTypes from 'prop-types'

class ImagePicker extends Component {

  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    sequence: PropTypes.number,
    disabled: PropTypes.bool,
    closeable: PropTypes.bool,
  }

  constructor (props) {
    super(props)
    const value = props.value
    this.state = {
      value,
      coverfix: '',
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState(Object.assign({}, this.state, {
        loading: true,
      }))
    } else {
      this.setState(Object.assign({}, this.state, {
        loading: false,
      }))
    }
    if (info.file.status === 'done') {
      if (info.file.response.resultCode !== '0000') {
        message.error(info.file.response.resultDesc)
      }
      const value = info.file.response.resultData.result
      this.setState(Object.assign({}, this.state, {
        value,
      }))
      this.props.onChange({
        key: this.props.sequence,
        value,
      })
    }
  }

  onClose (e) {
    e.stopPropagation()
    this.props.onClose(this.props.sequence)
  }

  onPreview (e) {
    e.stopPropagation()
    this.setState(Object.assign({}, this.state, {
      previewVisible: true,
    }))
  }

  onPicCancel () {
    this.setState(Object.assign({}, this.state, {
      previewVisible: false,
    }))
  }

  onImgLoad (e) {
    const img = e.target
    let coverfix = ''
    if ((img.naturalHeight > img.naturalWidth) || (img.height > img.width)) {
      coverfix = 'img-coverfix'
    } else {
      coverfix = ''
    }
    this.setState(Object.assign({}, this.state, {
      coverfix,
    }))
  }

  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || undefined
      this.setState(Object.assign({}, this.state, {
        value,
      }))
    }
  }

  render () {
    const { previewVisible, loading = false } = this.state
    const {
      disabled,
      value,
    } = this.props

    function beforeUpload (file) {
      const isImg = /image.*/.test(file.type)
      if (!isImg) {
        message.error('只能上传图片')
      }
      return isImg
    }

    return (
      <div className="flex flex-v">
        <Upload
          className="avatar-uploader"
          action={getBaseUrl() + '/pic/upload'}
          beforeUpload={beforeUpload}
          headers={{
            Authorization: 'bearer ' + sessionStorage.getItem('accessToken'),
          }}
          onChange={this.handleChange}
          showUploadList={false}
          disabled={disabled}
        >
          {
            <Spin spinning={loading}>
              <div className={'img-wrapper ' + this.state.coverfix}>
                {
                  this.state.value
                    ? <img ref="img" src={this.state.value} alt="" onLoad={::this.onImgLoad} />
                    : <Icon type="plus" />
                }
              </div>
            </Spin>
          }
          {
            this.state.value &&
            <Button shape="circle" icon="eye-o" className="ant-upload-preview" onClick={::this.onPreview} />
          }
          {
            !disabled && this.props.closeable &&
            <Button shape="circle" icon="close" className="ant-upload-close" onClick={::this.onClose} />
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={::this.onPicCancel}>
          <img style={{ width: '100%' }} src={this.state.value} />
        </Modal>
      </div>
    )
  }
}

export default class ImagePickerGroup extends Component {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    onChange: PropTypes.func,
    tokenSeparators: PropTypes.string,
    disabled: PropTypes.bool,
  }

  constructor (props) {
    super(props)

    this.state = {
      items: props.value || [],
    }
  }

  onChange (value) {
    const {
      tokenSeparators,
    } = this.props
    let items = this.state.items
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators)
    }
    items = [
      ...items,
    ]
    items[value.key] = value.value
    this.props.onChange(this.parseValues(items))
  }

  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({
        items: value || [],
        disabled: nextProps.disabled,
      })
    }
  }

  formatValues (items) {
    const {
      tokenSeparators,
    } = this.props
    tokenSeparators && items.length !== 0 && (items = items.toString().split(tokenSeparators))
    return items
  }

  parseValues (items) {
    const {
      tokenSeparators,
    } = this.props
    tokenSeparators && (items = items.join(tokenSeparators))
    return items
  }

  add () {
    const defaultValue = {
      value: '',
    }
    let items = [
      ...this.state.items,
      defaultValue,
    ]
    this.setState({
      ...this.state,
      items,
    })
    this.props.onChange(this.parseValues(items))
  }

  onClose (seq) {
    const {
      tokenSeparators,
    } = this.props
    let items = this.state.items
    if (typeof this.state.items === 'string') {
      items = this.state.items && this.state.items.split(tokenSeparators)
    }
    items = [
      ...items,
    ]

    items.splice(seq, 1)

    this.setState({
      ...this.state,
      items: items,
    })

    this.props.onChange(this.parseValues(items))
  }

  render () {
    const {
      tokenSeparators,
    } = this.props

    const createItems = () => {
      let items = this.state.items
      items = this.formatValues(items)
      let res = items.map((item, index) => {
        return (
          <Col span={8} key={'upload' + index} style={{ marginBottom: 8 }}>
            <ImagePicker
              value={item}
              sequence={index}
              disabled={this.props.disabled}
              onChange={::this.onChange}
              onClose={::this.onClose}
              closeable={true}
            />
          </Col>
        )
      })
      // blank placeholder
      res.push(
        <Col span={8} key={'upload-placeholder'} style={{ marginBottom: 8 }}>
          <ImagePicker
            value={undefined}
            sequence={items.length}
            disabled={this.props.disabled}
            onChange={::this.onChange}
            onClose={::this.onClose}
            closeable={false}
            tokenSeparators={tokenSeparators}
          />
        </Col>)
      return res
    }

    return (
      <div value={this.state.item} className="imagepicker-container">
        <Row span={24}>
          {createItems()}
        </Row>
      </div>
    )
  }

}
