import React,{Component} from 'react';
import PureMixinRender from 'react-addons-pure-render-mixin';
import styles from './styles.less';


class LoadMore extends Component{
  
  constructor(props, context){
    super(props, context);
    this.shouldComponentUpdate = PureMixinRender.shouldComponentUpdate;
  }
  handleClick(){
    this.props.loadMoreFunc();
  }

  componentDidMount() {
    const wrapper = this.refs.wrapper;
    let timeID;
    const callback = () => {
      //获取wrapper 这个div距离top的距离
      const top = wrapper.getBoundingClientRect().top;
      console.log(top)
      // 获取屏幕的高度
      const windowHeight = window.screen.height;
      // 证明 wrapper 已经被滚动到暴露在页面可视范围之内
      if(top && top < windowHeight) {
        this.handleClick();
      }
    }
    window.addEventListener('scroll', () => {
      if(this.props.loadding) {
        return
      }
      // console.log(123)
      // 函数截流，保证在连续滚动的时候不会连续触发
      if(timeID) {
        clearTimeout(timeID)
      }
      timeID = setTimeout(callback, 1000)
    }, false)
  }

  componentWillUnmount() {
    //当组件被卸载后，应该取消window上的事件
    window.removeEventListener('scroll',() => {});
  }

  render(){
    return (
      <div className={styles.loadMore} ref="wrapper">
      {
        this.props.loadding
        ? <div>加载中...</div>
        : <div onClick={this.handleClick.bind(this)}>加载更多</div>
      }
      </div>
    );
  }
}
export default LoadMore;