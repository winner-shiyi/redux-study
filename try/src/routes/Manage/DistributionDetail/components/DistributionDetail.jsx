/**
 * Created by kakeiChen on 2017/7/24.
 */
import React,{Component} from 'react';
import {browserHistory} from 'react-router';
import { Form, Input, Row , Col , Table, Icon, Button, Upload, Modal } from 'antd';
import { createFormItem } from '../../../../components';
import { Scrollbars } from 'react-custom-scrollbars';
import {formatDate} from 'util/date';
import PreviewPic from '../../../../components/PreviewPic'

const FormItem = Form.Item;

class DistributionDetailForm extends Component {
    constructor(props) {
        super(props);
    }

    goDispatch(){
      browserHistory.push('/Manage/ChooseDriver/' + this.props.paramsId);
    }

    componentDidMount () {
      //console.log(this.props.params.id)
    }

  render () {
      const {
        form,
        fields,
        orderInfo,
        values,
        receiversInfoList,
        orderStatus
      } = this.props;

      const { getFieldDecorator } = form;

      const formItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 8 },
      };

      if(receiversInfoList && receiversInfoList.length !=0 ){
        receiversInfoList.map((item,index)=>{
          item.key = index;
        })
      }

      let punchInfo = values.punchInfo;
      let cardArray = [];

      if( punchInfo && punchInfo.length !=0 ){
        punchInfo.map((item,index) => {
          let theBooleans  = [item.hasArrived,item.hasLeft,item.receiverFlag];
          // console.log(theBooleans);
          theBooleans = theBooleans.join();
          
          let newItem,newItem2;
          if (theBooleans == [true,true,true]){
            newItem = {
              node:"到达"+'发货地：'+ item.shopName,
              time : formatDate(item.arriveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualArriveAddress
            };
            newItem2 = {
              node:"离开"+'发货地：'+ item.shopName,
              time : formatDate(item.leaveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualLeaveAddress
            };
            cardArray.push(newItem);
            cardArray.push(newItem2);
          }else if(theBooleans == [true,true,false]){
            newItem = {
              clockSort:index,
              node:"到达"+'收货地：'+ item.shopName,
              time : formatDate(item.arriveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualArriveAddress
            };
            newItem2 = {
              clockSort:index,
              node:"离开"+'收货地：'+ item.shopName,
              time : formatDate(item.leaveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualLeaveAddress,
              stopTime:'3',
            };
            cardArray.push(newItem);
            cardArray.push(newItem2);
          }else if(theBooleans == [true,false,true]){ // receiverFlag true 
            newItem = {
              node:"到达"+'发货地：'+ item.shopName,
              time : formatDate(item.arriveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualArriveAddress
            };
            cardArray.push(newItem);
          }else if(theBooleans == [true,false,false]){ // 到达，没有离开， false
            newItem = {
              clockSort:index,
              node:"到达"+'收货地：'+ item.shopName,
              time : formatDate(item.arriveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualArriveAddress
            };
            cardArray.push(newItem);
          }else if(theBooleans == [false,true,true]){
            newItem = {
              node:"离开"+'发货地：'+ item.shopName,
              time : formatDate(item.leaveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualLeaveAddress
            };
            cardArray.push(newItem);
          }else if(theBooleans == [false,true,false]){
            newItem = {
              clockSort:index,
              node:"离开"+'收货地：'+ item.shopName,
              time : formatDate(item.leaveTime,'yyyy-MM-dd HH:mm:ss'),
              address : item.actualLeaveAddress,
              stopTime:'3',
            };
            cardArray.push(newItem);
          }
          // console.log(cardArray);
          // console.log(map[str](item,index));
          cardArray.map((item,index)=>{
            item.key = index;
          })
        })
      }


      const customerInfo = (receiversInfoList) => {
        const columns = [{
          title: '收货商家名称',
          dataIndex: 'shopName',
          key: 'shopName',
        }, {
          title: '收货地址',
          dataIndex: 'address',
          key:'address',
        }, {
          title: '收货联系电话',
          dataIndex: 'phone',
          key: 'phone',
        }, {
          title: '收货状态',
          dataIndex: 'receiverStatus',
          key: 'receiverStatus',
          render: (text, record, index) => {
            const textStatus = ['未处理', '已妥投', '未妥投']
            return textStatus[Number(record.receiverStatus-1)]
          }
        }, {
          title: '文字备注',
          dataIndex: 'textTip',
          key: 'textTip',
        }, {
          title: '图片备注',
          dataIndex: 'imageTip',
          key: 'imageTip',
          render: (text, record, index) => (
            <div>
              {
                record.imageTip.length > 0 &&
                <PreviewPic imagrUrlArr={record.imageTip} width={50} height={50} />
              }
            </div>
          ),
        },
      ];
        return (
          <div style={{marginTop:'20px'}} >
            <Table title={() => '收货信息'} columns={columns} pagination={{ pageSize: 10 }} dataSource={receiversInfoList} />
          </div>
        )
      };

      const orderForm = (fields) => {
        return (
          <Scrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax={550}>
            <Form layout="horizontal">
              <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
                {getFieldDecorator('id', {
                })(
                    <Input type="hidden" />
                )}
              </FormItem>
              <Row>
                {
                  fields.map((item) => {
                    return (
                      createFormItem({
                        field: item,
                        form,
                        formItemLayout,
                        inputOpts: {
                        },
                      })
                    )
                  })
                }
              </Row>
            </Form>
          </Scrollbars>
        )
      };

      const driverForm = (fields) => {
        return (
          <div>
            <Row><h3 style={{ marginTop: '20px',marginBottom: '20px', 'textAlign':'center', fontSize: '16px' }}>司机信息</h3></Row>
            <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={550}>
              <Form layout="horizontal">
                <FormItem label="" {...formItemLayout} style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    })(
                      <Input type="hidden" />
                  )}
                </FormItem>
                <Row>
                  {
                    fields.map((item) => {
                      return (
                        createFormItem({
                          field: item,
                          form,
                          formItemLayout,
                          inputOpts: {
                          },
                        })
                      )
                    })
                  }
                </Row>
              </Form>
            </Scrollbars>
          </div>
        )
      };

      const clockForm = (clockData) => {
          const columns = [
            {
              title: '排线次序',
              dataIndex: 'clockSort',
              key: 'clockSort',
            }, 
            {
              title: '打卡节点',
              dataIndex: 'node',
              key: 'node',
            }, 
            {
              title: '打卡时间',
              dataIndex: 'time',
              key:'time',
            }, 
            {
              title: '停留时间',
              dataIndex: 'stopTime',
              key:'stopTime',
            },
            {
              title: '打卡地址信息',
              dataIndex: 'address',
              key: 'addresss',
            },
          ];
          return (
              <div style={{marginTop:'20px'}} >
                  <Table title={() => '打卡信息'} columns={columns} pagination={{ pageSize: 10 }} dataSource={clockData} />
              </div>
          )
      };

      return (
          <div>
              {orderForm(orderInfo)}
              {customerInfo(receiversInfoList)}
              {values.driverId && orderStatus !='待分配' ? driverForm(fields):''}
              {values.driverId && orderStatus !='待分配' ? clockForm(cardArray):''}
              {orderStatus =='待分配' ? <div className='dispatch' >
                  <Button type="primary" onClick={::this.goDispatch} >派单</Button>
              </div>:''}
          </div>
      )
  }
}

let DistributionDetail = Form.create({
    mapPropsToFields (props) {
        const res = {}
        for (let i in props.values) {
            res[i] = { value: props.values[i] }
        }
        return res
    },
})(DistributionDetailForm)

export default DistributionDetail
