// 引入React
import React from 'react'
import ReactDOM from 'react-dom'

// 引入全局css
import './stylesheets/app.css'

// 引入组件
import App from './components/App'

// 引入Redux
import {createStore} from 'redux';  
// 需要使用redux的createStore方法创建store
import {Provider} from 'react-redux';   
// 需要使用react-redux封装好的控件Provider包裹App组件
import indexReducer from './redux/indexReducer';    // 导入合并好的全局reducer

// 使用createStore创建一个全局的store用来保存全局的state
const store = createStore(indexReducer)

// store.getState() // 可以在控制台看到整个state状态树
// setInterval(() => {
//     console.log('total state状态树当前是：', store.getState());
// }, 3000)

ReactDOM.render(
    // 使用Provider组件包裹App组件，把store作为props传入
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)