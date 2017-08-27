import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ListPage from '../../../../components/ListPage'
import { browserHistory } from 'react-router'

class View extends Component {
  constructor (props) {
    super(props);
    this.state = {
      index:-1,
      driverId:'',
    }
  }

  componentDidMount () {
    let { props } = this;
    props.searchCar({ token:sessionStorage.getItem('accessToken') });
    props.searchDriver(this.props.searchParams);

  }

  search (params) {
    this.props.searchDriver(params);
  }

  dispatchOrder(){
    let that = this;
    let param = {};
    param.orderNo = that.props.params.id;
    param.driverId = that.state.driverId;
    this.props.dispatchOrder(param).then(
      () => {
        let { paths } = this.props;
        if (paths) {
          browserHistory.push(paths);
        }
      }
    )
  }

  render () {
    const {
      data,
      carClassesData,
      driverStatus,
      carLengthData,
      isCanChoose,
      page,
    } = this.props;
    let {
      index
      } = this.state;

    let dictionary = {
      '0':'配送中',
      '1':'已完成'
    };

    const routeId = this.props.params.id

    const columns = [
      {
        label: '司机ID',
        name: 'driverId',
        search: false,
        hidden: true,
      },
      {
        label: '司机姓名',
        name: 'driverName',
        search: true,
        max: 20,
      },
      {
        label: '车牌',
        name: 'carNumber',
        search: true,
      },
      {
        label: '车辆类型',
        name: 'carType', // 表格中的值
        type: 'select',
        data: carClassesData, // 搜索部分下拉框的值
        search: true,
      },
      {
        label: '车厢长度',
        name: 'carLength',
        data: carLengthData,
      },
      {
        label: '司机工作状态',
        name:'driverWorkStatus',
        type: 'select',
        data:driverStatus,
      },
      {
        label: '进行中任务数',
        name: 'driverOrderCount',
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record, index) => {
          return <span>
            {
              routeId && isCanChoose[index] === 1 
              ? <Button ref="choose" type="secondary" onClick={
                () => {
                  let item = isCanChoose;
                  console.log('item', item)
                  if ( this.state.index !== -1 ) {
                    item[this.state.index] = 1
                  };
                  item[index] = 2;
                  this.setState({
                    isCanChoose:item,
                    index:index,
                    driverId:record.driverId
                  })
                }
              }>选择</Button> 
              : routeId && isCanChoose[index] === 2 ? '已选择' : ''
            } 
            {/* {
              record.lock 
              ? <Button type="secondary" onClick={() => {
                this.props.mockRadio(record.driverId)
              }}>测试</Button>
              : 'aaa'
            } */}
          </span>
        },
      },
    ];

    return (
      <div style={{ width:'100%' }} >
        <ListPage
          {...this.props}
          search={this.search.bind(this)}
          title="分配司机"
          columns={columns}
          formWidth={600}
          data={data.driverList}
          page={page}
          />
        {
          routeId && 
          <div style={{ textAlign:'center', marginBottom:'20px' }} >
            <Button type="secondary" onClick={this.dispatchOrder.bind(this)} >派单</Button>
          </div>
        }
      </div>
    )
  }
}

export default View
