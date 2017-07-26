import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ListPage1 from '../../../../components/ListPage1'
import './style.scss'
import { Link, browserHistory } from 'react-router'

class View extends Component {

  componentDidMount () { // 一进入页面后把table渲染出来
    this.props.search({
      ...this.props.searchParams,
      ...this.props.page,
    })
  }

  render () {
    const {
      record,
    } = this.props

    const columns = [
      {
        title: '订单编号',
        search: true,
        dataIndex: 'orderId',
        key: 'orderId',
      }, 
      {
        title: '发货地址',
        dataIndex: 'sendAddress',
        key: 'sendAddress',
      },
      { 
        title: '订单状态',
        dataIndex: 'orderStatusName',
        search: true,
        type: 'select',
        data: [['0', '待配单'], ['1', '配送中'], ['2', '待取货'], ['3', '已取消']],
        key: 'orderStatusName',
      }, 
      {
        title: '发货人电话',
        dataIndex: 'sendMobile',
        key: 'sendMobile',
        search: true,
        max: 11,
        hidden: true,
      },
      {
        title: '司机姓名',
        dataIndex: 'driverName',
        key: 'driverName',
        search: true,
        max: 20,
      }, 
      {
        title: '司机电话',
        dataIndex: 'driverMobile',
        key: 'driverMobile',
        search: true,
        max: 11,
      }, 
      {
        title: '收货人电话',
        dataIndex: 'consigneePhone',
        key: 'consigneePhone',
        max: 11,
      },
      {
        title: '收货地址',
        dataIndex: 'receivingAddress',
        key: 'receivingAddress',
      },
      {
        title: '操作',
        key: 'action',
        // width: 360,
        render: (text, record, index) => (
          <span>
            <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">明细</Link>
            {
              record.orderStatus === '0' && // 修改  0-待配单；1-配送中；2-待取货；3-已取消
              <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">派单</Link>
            }
            {
              record.orderStatus !== '3' &&
              <Button type="danger" onClick={
                (() => {
                  Modal.confirm({
                    title: '确定要取消该订单吗？',
                    onOk: (() => {
                      this.props.setStatus(record, index).then((success) => {
                        success && this.props.search({
                          ...this.props.searchParams,
                          ...this.props.page,
                        })
                      })
                    }).bind(this),
                    onCancel () {},
                  })
                }).bind(this)
              }>取消</Button>
            }
          </span>
        ),
      },
    ]

    return (
      <ListPage1
        {...this.props}
        title="车配任务管理"
        columns={columns}
        record={record}
      />
    )
  }
}

export default View
