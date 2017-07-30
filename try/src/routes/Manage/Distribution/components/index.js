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
    // const {
    //   record,
    // } = this.props

    const columns = [
      {
        title: '订单编号',
        search: true,
        dataIndex: 'orderNo',
        key: 'orderNo',
      }, 
      {
        title: '发货地址',
        dataIndex: 'address',
        key: 'address',
      },
      { 
        title: '订单状态',
        dataIndex: 'orderStatus',
        search: true,
        type: 'select',
        data: [['1', '待配单'], ['2', '待取件'], ['3', '配送中'], ['4', '已完成'], ['5', '已取消']],
        key: 'orderStatus',
        render: (text, record, index) => {
          const statusName = record.orderStatus
          const statusObj = { '1': '待配单', '2': '待取件', '3': '配送中', '4': '已完成', '5': '已取消' }
          const statusValue = statusObj[statusName]
          return statusValue
        },
      }, 
      {
        title: '发货人电话',
        dataIndex: 'phone',
        key: 'phone',
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
        dataIndex: 'driverPhone',
        key: 'driverPhone',
        search: true,
        max: 11,
      }, 
      {
        title: '收货商家名称',
        dataIndex:'receiverUserName',
        max: 50,
        render: (text, record, index) => (
          record.receiversInfoList[0].userName + '...'
        ),
      },
      {
        title: '收货地址',
        dataIndex:'receiverAddress',
        max: 50,
        render: (text, record, index) => (
          record.receiversInfoList[0].address + '...'
        ),
      },
      {
        title: '收货方数量',
        dataIndex:'receiverNo',
        render: (text, record, index) => (
          record.receiversInfoList.length
        ),
      },
      {
        title: '操作',
        key: 'action',
        // width: 360,
        render: (text, record, index) => (
          <span>
            <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">明细</Link>
            {
              record.orderStatus === 1 && // 修改  1-待分配；2-已分配待取货；3-已取货配送中；4-已完成；5-已取消
              <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">派单</Link>
            }
            {
              record.orderStatus !== 5 &&
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
      />
    )
  }
}

export default View
