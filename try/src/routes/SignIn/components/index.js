import React, { Component } from 'react'
import { Form, Layout, Menu, Input, Icon, Checkbox, Button, notification } from 'antd'
import './style.scss'
import { Link, browserHistory } from 'react-router'

const { Header, Content, Sider, Footer } = Layout

const FormItem = Form.Item

const args = {
  message: 'Tips',
  description: <div>
    <div>保留用户、权限及一个示例模块</div>
    <div>菜单数据为假数据，现不是树形结构，待后期调整</div>
    <div>保留真实接口请求</div>
    <div>登录用户root/admin</div>
  </div>,
  duration: 0,
};
notification.open(args);

const createFormItem = (opts) => {
  let rules = []
  if (opts.require) {
    rules.push({ required: true, message: `请输入${opts.label}` })
  }
  if (opts.max) {
    rules.push({ max: opts.max, message: `${opts.label}必须小于${opts.max}个字符` })
  }
  if (opts.min) {
    rules.push({ min: opts.min, message: `${opts.label}必须大于${opts.min}个字符` })
  }
  if (opts.pattern) {
    rules.push({ pattern: opts.pattern, message: opts.patternMsg })
  }
  return opts.getFieldDecorator(opts.name, {
    rules: rules,
  })(<Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />)
}

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values)
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="login-logo-wrapper flex flex-c">
          <div className="login-logo"><img src="/logo.png" style={{ width: 120 }} /></div>
          <div className="login-logo-text">新辰产业园</div>
        </div>
        <FormItem>
          {createFormItem({
            getFieldDecorator: getFieldDecorator,
            require: true,
            icon: 'user',
            type: 'text',
            label: '账号',
            name: 'username',
            max: 50,
          })}
        </FormItem>
        <FormItem>
          {createFormItem({
            getFieldDecorator: getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'password',
            label: '密码',
            name: 'password',
            max: 20,
            min: 5,
            pattern: /^[0-9a-zA-Z]*$/,
            patternMsg: '密码只能是数字或英文大小写',
          })}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.props.loading}>
            登录
          </Button>
          <div className="login-fp">
            <Link to="/FindPwd" className="login-form-forgot">忘记密码</Link>
          </div>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

class View extends Component {

  login (values) {
    this.props.login(values).then((isSuccess) => {
      isSuccess && browserHistory.push('/Manage')
      // this.props.initCommon()
      isSuccess && this.props.initCompany()
    })
  }

  render () {
    return (
      <Layout className="login-layout">
        <Content style={{ padding: '0 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <WrappedNormalLoginForm
            login={::this.login}
            loading={this.props.loading}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; 产业互联技术中心
        </Footer>
      </Layout>
    )
  }
}

export default View
