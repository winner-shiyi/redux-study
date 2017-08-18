import React, { Component } from 'react'
import { Button, message } from 'antd'
import ListPage from '../../../../components/ListPage'
import { browserHistory } from 'react-router'

class View extends Component {
  constructor(props) {
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
      page
      } = this.props;

    // console.log(data.driverList);

    let {
      index
      } = this.state;

    let dictionary = {
      '0':'配送中',
      '1':'已完成'
    };

    const columns = [
      {
        label: '司机ID',
        name: 'driverId',
        search: false,
        hidden:true
      },
      {
        label: '司机名称',
        name: 'driverName',
        search: true,
      },
      {
        label: '车牌',
        name: 'carNumber',
        search: true,
      },
      {
        label: '车辆类型',
        name: 'carType',//表格中的值
        type: 'select',
        data: carClassesData,//搜索部分下拉框的值
        search: true,
      },
      {
        label: '车厢长度',
        name: 'carLength',
        data: carLengthData,
        search: false,
      },
      {
        label: '司机工作状态',
        name:'driverWorkStatus',
        type: 'select',
        data:driverStatus,
        search: false,
      },
      {
        label: '操作',
        name: 'action',
        render: (text, record, index) => {
          return <span>
            {
              isCanChoose[index] == 1 ? <Button ref='choose' type="secondary" onClick={
                () => {
                  let item = isCanChoose;
                  if( this.state.index != -1 ){
                    item[this.state.index] = 1
                  };
                  item[index] = 2;
                  this.setState({
                    isCanChoose:item,
                    index:index,
                    driverId:record.driverId
                  })
                }
              }>选择</Button>:isCanChoose[index]==2 ? '已选择':''
            }
          </span>
        },
      },
    ];

    return (
      <div style={{width:'100%'}} >
        <ListPage
          {...this.props}
          search={::this.search}
          title="分配司机"
          columns={columns}
          formWidth={600}
          data={data.driverList}
          page={page}
          />
        <div style={{textAlign:'center',marginBottom:'20px'}} >
          <Button type="secondary" onClick={::this.dispatchOrder} >派单</Button>
        </div>
      </div>
    )
  }
}

export default View
