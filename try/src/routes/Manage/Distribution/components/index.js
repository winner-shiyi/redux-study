import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ListPage1 from '../../../../components/ListPage1'
import './style.scss'
import { Link, browserHistory } from 'react-router'

class View extends Component {

  edit (record, index) {
    record.roleId = record.roleIdList[0]
    this.props.detail(record)
    this.props.edit(record)
    this.props.roleSearch()
    // this.props.gardenSearch({
    //   pageSize: 10,
    //   pageNo: (+this.props.garden.pageNo || 0) + 1,
    // })
  }

  delete (record, index) {
    this.props.del()
  }

  active (record) {
    this.props.active(record).then(() => {
      this.props.search({
        ...this.props.searchParams,
        pageNo: 1,
        pageSize: 10,
      })
    })
  }

  resetPwd (record, index) {
    this.props.resetPwd(record).then((text) => {
      Modal.success({
        content: (
          <div>
            <h3 className="new-pwd-title">重置成功，新密码为</h3>
            <h2 className="new-pwd">{text}</h2>
          </div>
        ),
        onOk () {},
      })
    })
  }

  componentDidMount () { // 一进入页面后把table渲染出来
    this.props.search({
      ...this.props.searchParams,
      ...this.props.page,
    })
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

    if (!isEdit) {
      const gardenFld = activeFormField.find((f) => {
        return f.name === 'gardenId'
      })
      gardenFld.page = garden
      gardenFld.action = gardenSearch
    }

    const columns = [
    {
      title: '订单编号',
      search: true,
      dataIndex: 'officeName',
      key: 'officeName',
    }, 
    {
      title: '发货地址',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
    },
    {
      title: '状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    }, 
    {
      title: '司机姓名',
      dataIndex: 'name',
      key: 'name',
      search: true,
      max: 20,
    }, 
    {
      title: '司机电话',
      dataIndex: 'sendPhone',
      key: 'sendPhone',
      search: true,
      max: 11,
    }, 
    {
      title: '收货人电话',
      dataIndex: 'getPhone',
      key: 'getPhone',
      search: true,
      max: 11,
    },
    {
      title: '收货地址',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
    },
    {
      title: '操作',
      key: 'action',
      // width: 360,
      render: (text, record, index) => (
        <span>
          <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">查看明细</Link>
          {
            record.orderStatus !== '0' && // 修改 为全等
            <Button onClick={
              (() => {
                Modal.confirm({
                  title: '确定要启用该账号吗？',
                  onOk: (() => {
                    this.active(record, index)
                  }).bind(this),
                  onCancel () {},
                })
              }).bind(this)
            }>派单</Button>
          }
          {
             record.accountStatus !== '3' &&
            <Button type="danger" onClick={
              (() => {
                Modal.confirm({
                  title: '确定要取消该订单吗？',
                  onOk: (() => {
                    this.active(record, index)
                  }).bind(this),
                  onCancel() {},
                })
              }).bind(this)
            }>取消</Button>
          }
        </span>
      ),
    }]

    // const buttons = [{
    //   label: '新增账号',
    //   hidden: !permission.create,
    //   onClick: () => {
    //     this.props.add()
    //     this.props.roleSearch()
    //   },
    // }]

    const tableOpts = {
    }

    return (
      <ListPage1
        {...this.props}
        title="车配任务管理"
        columns={columns}
        fields={activeFormField}
        tableOpts={tableOpts}
        permission={permission}
        record={record}
        formWidth={645}
        changeRecord={changeRecord}
      />
    )
  }
}

export default View
