/**
 * AppBar
 * Created by weina
 */
import React, {Component} from 'react'
import './app-bar.css'

export default class AppBar extends Component {
    render() {
        return (
            <section className="app-bar">
                <div className="title">待办事项</div>
            </section>
        )
    }
}
