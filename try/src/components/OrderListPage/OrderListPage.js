import React, { Component } from 'react'
import { Row, Col, Modal, Upload, message, Button, Icon } from 'antd'
import { getBaseUrl } from '../../util'
import PropTypes from 'prop-types'
import Table from '../Table'
import SearchForm from '../SearchForm'
import { Link } from 'react-router'
import './style.scss'

export default class OrderListPage extends Component {
  static propTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array,
    search: PropTypes.func,
    changeSearch: PropTypes.func,
    reset: PropTypes.func,
    searchParams: PropTypes.object,
    page: PropTypes.object,
  }
  clearUploadFileList () { // 清空上传文件
    let { entryData } = this.refs
    let { upload } = entryData.refs

    upload.setState({
      fileList: [],
    }, () => {
    })
  }
  render () {
    const {
      title,
      loading = false,
      columns,
      data,
      search,
      changeSearch,
      searchParams,
      page,
      style,
      expandedRowRender,
      reset,
    } = this.props

    return (
      <div style={{ padding: 16, flex: 'auto', ...style }} >
        {
          (title) &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
            <Col>
              <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">新建车配任务</Link>
              <Button type="primary" htmlType="submit" onClick={this.props.showModal} 
                className="order-upload-btn">订单批量导入</Button>
            </Col>
          </Row>
        }
        <SearchForm
          fields={columns.filter(item => !!item.search)}
          search={search}
          changeSearch={changeSearch}
          searchParams={searchParams}
          page={page}
          reset={reset}
        />
        <Table
          {...this.props}
          columns={columns.filter((item) => !item.hidden)}
          dataSource={data}
          loading={loading}
          search={search}
          expandedRowRender={expandedRowRender}
          rowKey="orderNo"
          pagination={
            page ? {
              current: page.pageNo,
              total: page.total,
              pageSize: page.pageSize || '10',
            } : null
          }
        />
        <Modal 
          title="订单批量导入"
          width="600px"
          maskClosable={false}
          visible={this.props.visible}
          onCancel={this.props.cancel}
          footer={null}
          afterClose={this.clearUploadFileList.bind(this)}
        >
          <EntryData ref="entryData" that={this} />
        </Modal>
      </div>
    )
  }
}
class EntryData extends Component {
  render () {
    let { that } = this.props // 表示OrderListPage组件
    const _this = this
    const uploadProps = {
      name: 'file',
      defaultFileList: [],
      action: getBaseUrl() + '/order/import',
      headers: {
        authorization: '', 
      },
      onChange (info) { // 上传中、完成、失败都会调用这个函数
        if (info.file.status === 'done') {
          if (info.file.response.resultCode === '0') {
            if (Number(info.file.response.resultData.successCount) > 0) {
              let errorStr = ''
              if (info.file.response.resultData.errorOrderNo.length) {
                const errorStrNo = info.file.response.resultData.errorOrderNo.join('、')
                errorStr = '；订单编号' + errorStrNo + '上传失败'
                message.success('已成功上传' + info.file.response.resultData.successCount + '条订单' + errorStr, 5)
              } else {
                message.success('已成功上传' + info.file.response.resultData.successCount + '条订单')
              }
              that.props.search({
                ...that.props.searchParams,
                ...that.props.page,
              })
            } else {
              message.error('订单全部上传失败，请认真检查格式哟~', 5)
            }
          }
          let { upload } = _this.refs
          upload.setState({
            fileList: [...upload.state.fileList].slice(0, -1), // 清空上传文件列表
          })
        }
      },
      beforeUpload (file, fileList) { // 上传文件之前的钩子，参数为上传的文件
        const suffix = file.name.split('.').pop()
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          message.error('文件大小不能超过5MB', 3)
          return false
        }
        if (suffix === 'xlsx' || suffix === 'xls') {
          return true
        } else {
          message.error('请选择Excel文件', 3)
          return false
        }
      },
      onRemove (info) { // 点击移除文件时的回调，返回值为 false 时不移除
        return true
      },
    }
    return (
      <div>
        <p>1、将订单信息填入Excel模板；</p>
        <p>2、将填好订单信息的Excel模板上传；</p>
        <Upload ref="upload" {...uploadProps}>
          <Button style={{ marginTop:'16px' }}>
            <Icon type="upload" /> 选择导入文件
          </Button>
        </Upload>
        <div style={{ display:'block', textAlign:'center', marginTop:'16px' }}>
          <Button size="large" type="primary" onClick={that.props.cancel}>确定</Button>
        </div>
      </div>  
    )
  }
}
