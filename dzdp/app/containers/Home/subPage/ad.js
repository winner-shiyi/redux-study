import React,{Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {get} from '../../../fetch/get';
import HomeAd from '../../../components/HomeAd';
class Ad extends Component{
  constructor(props, context){
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    this.state = {
      data: ''
    }
  }

  componentDidMount(){
    this.getData();
  }

  async getData(){
    try {
      const res = await get('/api/homead');
      const json = await res.json();
      let data = json;
      if(data.length){
        this.setState({
          data: data 
        });
      }
    } catch (error) {
      // 发生错误
      if (__DEV__) {
          console.error('首页广告模块获取数据报错, ', error.message)
      }
    }
  }

  render(){
    return (
      <div>
        {
          this.state.data.length ? <HomeAd data={this.state.data}/> : '加载中...'
        }
      </div>
    );
  }
}



export default Ad;
