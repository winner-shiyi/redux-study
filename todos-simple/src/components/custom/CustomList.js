/**
 * 待办事项列表
 */
import React,{ Component } from 'react'
import AppBar from '../common/app-bar/AppBar'
import CustomItem from './custom-item/CustomItem'

// 引入用到的action
import {addCustomItemAction} from '../../redux/custom/actions'
// 引入connect函数用来生成Redux组件
import {connect} from 'react-redux'




class CustomList extends Component {
    constructor(props) {
        super(props)
        // 这个state是本地state，它存在的意义是为了获得用户的输入文本
        this.state = {
            text:'',
        }
    }
    handleClick() {
        console.log('添加 click')
        // 发送添加todo项Action
        if(!this.state.text.trim()) {return}
        this.props.dispatch(addCustomItemAction(this.state.text))
        // 把输入置为空
        this.setState({
            text: ''
        })
    }
    handleChange(e) {
        this.setState({
            text: e.target.value
        })
    }
    render() {
        return (
            <section className="custom">
                <AppBar/>
                {/*this.props.customListBBB 拿到的就是todos的数组*/}
                <ul>
                {
                    this.props.customListBBB.map(item => {
                       return <CustomItem 
                            key={item.id}
                            id={item.id}
                            completed={item.completed}
                            text={item.text}
                       />
                    })
                }
                </ul>
                <div>
                    <input 
                        type="text" 
                        value={this.state.text}
                        onChange={this.handleChange.bind(this)}
                         />
                    <button
                        onClick={this.handleClick.bind(this)}
                    >添加</button>
                </div>
            </section>
        )
    }
}

// 关联props与redux中存放的全局state状态树
// 不关联的话全局的state.customListAAA就没法作为props属性传进来
const mapStateToProps = (state) => {
    return {
        customListBBB: state.customListAAA
    }
}
// 这个方法是用来绑定dispatch的，这里直接在组件里调用dispatch了，所以就没有用到这个方法
// const mapDispatchToProps = (dispatch) => {
//     return {
//         onBtnClick: (customItemText) => {
//             dispatch(addCustomItemAction(customItemText))
//         },
//         onTodoClick: (customItemId) => {
//             dispatch(changeCustomItemCompletionStatusAction(customItemId))
//         }
//     }
// }

// this.props.customListBBB可以访问到state.customListAAA
// 使用connect函数包裹组件，从而获得store上下文，可以在组件里使用this.props.dispatch访问到dispatch方法



CustomList = connect(mapStateToProps)(CustomList)
export default CustomList

