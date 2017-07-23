import React, { Component } from 'react'
import { Upload, Modal, Icon, Input, DatePicker, Row, Col, Button, Form, Spin, message } from 'antd'
import CommonSelect from '../Select'
import moment from 'moment'
import './style.scss'
import { getBaseUrl } from '../../util'

const FormItem = Form.Item

class IDPhoto extends Component {

  constructor (props) {
    super(props)
    const values = props.values
    this.state = {
      imgUrl: values.imgUrl,
      type: values.type,
      expireTime: values.expireTime,
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
      const imgUrl = info.file.response.resultData.result
      this.setState(Object.assign({}, this.state, {
        imgUrl: imgUrl,
      }))
      this.props.onChange({
        key: this.props.sequence,
        imgUrl: imgUrl,
      })
    }
  }

  onNameChange = (e) => {
    this.setState(Object.assign({}, this.state, {
      type: e.target.value,
    }))
    this.props.onChange({
      key: this.props.sequence,
      type: e.target.value,
    })
  }

  onDateChange = (value) => {
    const time = value ? value.format('YYYY-MM-DD') : ''
    this.setState(Object.assign({}, this.state, {
      expireTime: time,
    }))
    this.props.onChange({
      key: this.props.sequence,
      expireTime: time,
    })
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
    if ('values' in nextProps) {
      const values = nextProps.values || {}
      this.setState(Object.assign({}, this.state, {
        ...values,
      }))
    }
  }

  render () {
    const { previewVisible, loading = false } = this.state
    const {
      disabled,
      values = {},
      form,
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
                  this.state.imgUrl
                    ? <img ref="img" src={this.state.imgUrl} alt="" onLoad={::this.onImgLoad} />
                    : <Icon type="plus" className={disabled && 'ant-upload-blank'} />
                }
              </div>
            </Spin>
          }
          {
            this.state.imgUrl &&
            <Button shape="circle" icon="eye-o" className="ant-upload-preview" onClick={::this.onPreview} />
          }
          {
            !disabled && this.props.closeable && this.props.sequence !== 0 &&
            <Button shape="circle" icon="close" className="ant-upload-close" onClick={::this.onClose} />
          }
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={::this.onPicCancel}>
          <img style={{ width: '100%' }} src={this.state.imgUrl} />
        </Modal>
        {
          ('type' in values) &&
          <div style={this.props.typeHidden ? { display: 'none' } : { display: 'block' }}>
            证件名称：
            <Input
              style={{ width: 147 }}
              value={this.state.type}
              disabled={this.props.values && this.props.values.typeDisabled || this.props.typeDisabled || disabled}
              onChange={this.onNameChange}
            />
          </div>
          // <div style={this.props.typeHidden ? { display: 'none' } : { display: 'block' }}>
          // 证件名称：
          // <Input
          //   style={{ width: 147 }}
          //   value={this.state.type}
          //   disabled={this.values && this.values.typeDisabled || this.props.typeDisabled || disabled}
          //   onChange={this.onNameChange}
          // />
          // </div>
        }
        {
          ('expireTime' in values) &&
          <div style={this.props.timeHidden ? { display: 'none' } : { display: 'block' }}>
            有效期至：
            <DatePicker
              value={this.state.expireTime ? moment(this.state.expireTime) : null}
              disabled={this.props.timeDisabled || disabled}
              onChange={this.onDateChange}
              placeholder=""
            />
          </div>
        }
      </div>
    )
  }
}

export default class IDPhotoGroup extends Component {

  constructor (props) {
    super(props)

    this.state = {
      items: props.value || props.data || [],
    }
  }

  onChange (value) {
    let items = [
      ...this.state.items,
    ]
    let item = {
      ...items[value.key],
      ...value,
    }
    delete item.key
    items[value.key] = item
    this.props.onChange(items)
  }

  componentWillReceiveProps (nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value || nextProps.data
      this.setState({
        items: value || [],
        disabled: nextProps.disabled,
      })
    }
  }

  add () {
    const defaultValue = {
      imgUrl: '',
      type: '',
      expireTime: '',
    }
    let items = [
      ...this.state.items,
      defaultValue,
    ]
    this.setState({
      ...this.state,
      items,
    })
    this.props.onChange(items)
  }

  onClose (seq) {
    const items = [
      ...this.state.items,
    ]

    items.splice(seq, 1)

    this.setState({
      ...this.state,
      items: items,
    })

    this.props.onChange(items)
  }

  render () {
    const {
      addText,
    } = this.props

    const createItems = () => {
      const items = this.state.items
      let res = items.map((item, index) => {
        return (
          <Col span={6} key={'upload' + index}>
            <IDPhoto
              values={item}
              sequence={index}
              disabled={this.props.disabled}
              onChange={::this.onChange}
              onClose={::this.onClose}
              closeable={this.props.closeable}
              typeDisabled={this.props.typeDisabled}
              typeHidden={this.props.typeHidden}
              timeHidden={this.props.timeHidden}
              form={this.props.form}
            />
          </Col>
        )
      })
      return res
    }

    return (
      <div value={this.state.item} className="uploader-container">
        <Row span={24}>
          {createItems()}
          {
            !this.props.disabled && this.props.add &&
            <Button onClick={::this.add}>
              {addText && addText || '新增证件'}
            </Button>
          }
        </Row>
      </div>
    )
  }

}
