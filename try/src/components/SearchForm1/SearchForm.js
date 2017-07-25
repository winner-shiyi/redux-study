import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Button,
  Icon
} from 'antd'
import { createFormItem } from '../../components'
import PropTypes from 'prop-types'
import './SearchForm.scss'

const FormItem = Form.Item

class AdvancedSearchForm extends Component {

  static propTypes = {
    form: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    search: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      expand: document.body.clientWidth > 768,
    }

    this.responsiveHandler = ((e) => {
      if (e.matches) {
        this.setState({
          expand: false,
        })
      } else {
        this.setState({
          expand: true,
        })
      }
    }).bind(this)
  }

  componentDidMount () {
    this.getValues((value) => {
      this.props.initSearchParams && this.props.initSearchParams(value)
    })
    this.mql = window.matchMedia('(max-width: 768px)')
    this.mql.addListener(this.responsiveHandler)
  }

  componentWillUnmount () {
    this.mql && this.mql.removeListener(this.responsiveHandler)
  }

  getValues (callback) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const res = {}
        const {
          fields,
        } = this.props
        for (let i in values) {
          let field = fields.find((field) => { // TODO
            return (field.name || field.dataIndex) === i
          })
          switch (field.type) {
            case 'dateRange':
              res[i + 'Start'] = values[i] && values[i].length !== 0 && values[i][0].format
                ? values[i][0].format('YYYY-MM-DD 00:00:00') : values[i] && values[i][0]
              res[i + 'End'] = values[i] && values[i].length !== 0 && values[i][1].format
                ? values[i][1].format('YYYY-MM-DD 23:59:59') : values[i] && values[i][1]
              break
            case 'dateTimeRange':
              res[i + 'Start'] = values[i] && values[i].length !== 0 && values[i][0].format
                ? values[i][0].format('YYYY-MM-DD HH:mm:ss') : values[i] && values[i][0]
              res[i + 'End'] = values[i] && values[i].length !== 0 && values[i][1].format
                ? values[i][1].format('YYYY-MM-DD HH:mm:ss') : values[i] && values[i][1]
              break
            case 'monthRange':
              res[i + 'Start'] = values[i] && values[i].length !== 0 && values[i][0].format
                ? values[i][0].format('YYYY-MM-DD') : values[i] && values[i][0]
              res[i + 'End'] = values[i] && values[i].length !== 0 && values[i][1].format
                ? values[i][1].format('YYYY-MM-DD') : values[i] && values[i][1]
              break
            case 'date':
              res[i] = values[i] && values[i].format ? values[i].format('YYYY-MM-DD') : values[i]
              break
            case 'dateTime':
              res[i] = values[i] && values[i].format ? values[i].format('YYYY-MM-DD HH:mm:ss') : values[i]
              break
            case 'month':
              res[i] = values[i] && values[i].format ? values[i].format('YYYY-MM-01') : values[i]
              break
            default:
              res[i] = values[i]
          }
        }
        callback(res)
      }
    })
  }

  handleSearch = (e) => {
    this.getValues((values) => {
      const pageSize = this.props.page && this.props.page.pageSize || '10'
      this.props.search && this.props.search({
        ...values,
        pageNo: '1',
        pageSize: pageSize,
      })
    })
  }

  handleReset = () => {
    if (this.props.reset) {
      this.props.reset()
    } else {
      this.props.form.resetFields()
    }
  }

  render () {
    const {
      fields, // 从表格的列定义中拿到的字段
    } = this.props

    const {
      expand,
    } = this.state

    // To generate mock Form.Item
    const children = []
    const len = fields.length
    let labelCol = expand ? 7 : 4
    let wrapperCol = expand ? 17 : 20
    for (let i = 0; i < len; i++) {
      children.push(
          createFormItem({
            field: fields[i],
            form: this.props.form,
            formItemLayout: {
              labelCol: { span: fields[i].large ? 2 : labelCol },
              wrapperCol: { span: fields[i].large ? 22 : wrapperCol },
            },
            inputOpts: {
            },
            colSpan: !expand || fields[i].large ? 24 : 8,
          })
      )
    }

    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row gutter={20}>
          {children}
        </Row>
        <Row gutter={20}>
          <Col span={8} style={{ textAlign: 'left' }}>
            <FormItem wrapperCol={{ span: 17, offset: 7 }}>
              <Button type="primary" onClick={this.handleSearch} style={{ width: 195 }}>搜索</Button>
              {
                fields.length > 1 &&
                <Button style={{ marginLeft: 8, color: '#32b4ca', border: 'none' }} onClick={this.handleReset}>
                  重置
                </Button>
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedAdvancedSearchForm = Form.create({
  mapPropsToFields (props) {
    const res = {}
    for (let i in props.searchParams) {
      let param = props.searchParams[i]
      if (typeof param === 'object' && !(param instanceof Array)) {
        res[i] = param
      } else {
        res[i] = { value: param }
      }
    }
    return res
  },
  onFieldsChange (props, fields) {
    // let res = {}
    for (let v in fields) {
      const fld = props.fields.find(item => item.name === fields[v].name)
      fields[v].type = fld && fld.type
    }
    props.changeSearch && props.changeSearch({
      ...props.searchParams,
      ...fields,
    })
  },
})(AdvancedSearchForm)

export default WrappedAdvancedSearchForm
