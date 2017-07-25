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
                        console.log(record)
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
    /**
     * 新建车配任务 表单字段
     */
    const fields = {
      'send':[
        {
          'label': '商家名称',
          'required': true,
          'simple': true,
          'long': true,
          'type': 'AutoComplete',
          'valueName': 'id',
          'displayName': 'name',
          'state': {
            'data': [],
            'loading': false,
            'lastFetch': 0,
          },
        },
        {
          'label': '联系人',
          'name': 'name',
          'required': true,
          'long': true,
          'simple': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': 'phone',
          'required': true,
          'long': true,
          'simple': true,
          'phone': true,  
        },
        {
          'label': '用车时间',
          'name': 'loginName',
          'required': true,
          'type':'datetime',
          'long': true,
          'simple': true,
          'max': 50,
        },
        {
          'label': '发货地区',
          'required': true,
          'name': 'pwd',
          'type':'Cascader',
          'data':[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [{
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [{
                  value: 'xihu',
                  label: 'West Lake',
                }],
              }], 
            }, 
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [{
                value: 'nanjing',
                label: 'Nanjing',
                children: [{
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                }],
              }],
            },
          ],
          'changeOnSelect':'true', // 每选择一项就会马上改变
          'long': true,
          'simple': true,
        },
        {
          'label': '详细地址',
          'name': 'streetAdress',
          'required': true,
          'type':'textarea',
          'long': true,
          'simple': true,
          'max': 50,
        },
      ],
      'get':[
        {
          'label': '商家名称',
          'name': 'gardenId',
          'required': true,
          'simple': true,
          'long': true,
        },
        {
          'label': '联系人',
          'name': 'name',
          'required': true,
          'long': true,
          'simple': true,
          'max': 20,
        },
        {
          'label': '联系电话',
          'name': 'phone',
          'required': true,
          'long': true,
          'simple': true,
          'phone': true,
        },
        {
          'label': '送达时间',
          'name': 'loginName',
          'required': true,
          'type':'dateRange',
          'long': true,
          'simple': true,
          'max': 50,
        },
        {
          'label': '收货地区',
          'required': true,
          'name': 'pwd',
          'type':'Cascader',
          'data':[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [{
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [{
                  value: 'xihu',
                  label: 'West Lake',
                }],
              }], 
            }, 
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [{
                value: 'nanjing',
                label: 'Nanjing',
                children: [{
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                }],
              }],
            },
          ],
          'changeOnSelect':'true', // 每选择一项就会马上改变
          'long': true,
          'simple': true,
        },
        {
          'label': '详细地址',
          'name': 'streetAdress',
          'required': true,
          'type':'textarea',
          'long': true,
          'simple': true,
          'max': 50,
        },
      ],
    }

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
