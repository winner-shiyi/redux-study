import React,{ Component } from 'react'
import CustomList from './custom/CustomList'

// 先完成一个页面布局最大的组件的拼装
export default class App extends Component {
    render() {
        return (
            <section className="App">
                <CustomList/>
            </section>
        )
    }
}