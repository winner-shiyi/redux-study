import React,{Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {get} from '../../../fetch/get';
import ListComponent from '../../../components/ListComponent';
import LoadMore from '../../../components/LoadMore';
class List extends Component{
  constructor(props, context){
    super(props, context);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    this.state = {
      data: [],
      hasMore: true,
      loadding: false,
      page: 1  //下一页
    }
  }
  /**
   * 获取首页数据，组件渲染完以后
   */
  componentDidMount(){
    this.getData();
  }

  /**
   * 异步获取首屏数据
   */
  async getData(){
    try {
      // 访问的是首页 所以 是0
      const res = await get(`/api/homelist/${this.props.cityName}/0`);
      const data = await res.json();
      // console.log(data)
      /**
       * data是一个obj：{hasMore:true, data:array[5]}
       */
      this.handleData(data);
    } catch (error) {
      // 发生错误
      if (__DEV__) {
          console.error('首列表获取数据报错, ', error.message)
      }
    }
  }

  /**
   * 点击加载更多时候获取的数据
   */
  async loadMore(){
    // 点击【加载更多】瞬间记录状态
    this.setState({
      loadding: true
    });
    try {
      const res = await get(`/api/homelist/${this.props.cityName}/${this.state.page}`);
      const data = await res.json();
      this.handleData(data);
      // 获取更多数据后，在改变状态 
      this.setState({
        loadding: false,
        page: this.state.page+1
      });
    } catch (error) {
      // 发生错误
      if (__DEV__) {
          console.error('加载更多报错, ', error.message)
      }
    }
  }
  /**
   * 数据处理函数
   * @param {对象} data 
   */
  handleData(data){
    let hasMore = data.hasMore;
    // 下面这样赋值data，在首屏的时候是没问题的
    // 但是如果开始第二屏，第二屏数据直接赋值data，就会造成首屏数据没了
    // 所以这里要使用es6的数组的扩展...来合并首屏和加载更多的数据
    // this.setState({
    //   hasMore:hasMore,
    //   data:data,
    // })
    data = [...this.state.data,...data.data];
    // 等同于 this.state.data.concat(data)
    this.setState({data,hasMore});
  }

  render(){
    return (
      <div>
        <h2 className="home-list-title">猜你喜欢</h2>
        {
          this.state.data.length 
          ?<ListComponent data={this.state.data}/>
          :'加载中...'
        }
        {
          this.state.hasMore
          ? <LoadMore loadding={this.state.loadding} loadMoreFunc={this.loadMore.bind(this)}/>
          : ""
        }
      </div>
    );
  }
}

export default List;
