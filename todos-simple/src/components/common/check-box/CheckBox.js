/**
 * CheckBox
 * Created by weina
 */
import React, {Component} from 'react';
import './check-box.css';

export default class CheckBox extends Component {

    render() {
        let className = ''
        if (this.props.checked) {   // 判断选中状态，添加不同的类
            className = 'check-box checked';
        } else {
            className = 'check-box unchecked';
        }
        return (
            <section className={className}>
                <i className="material-icons">done</i>
            </section>
        )
    }
}
