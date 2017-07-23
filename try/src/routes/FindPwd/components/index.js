import React, { Component } from 'react'
import { Form, Layout, Menu, Input, Icon, Checkbox, Button } from 'antd'
import { Steps } from 'antd'
import { Link } from 'react-router'
import Captcha from '../../../components/Captcha'
import '../../../styles/core.scss'
import './style.scss'

const Step = Steps.Step

const { Header, Content, Sider, Footer } = Layout

const FormItem = Form.Item

const createInput = (opts) => {
  switch (opts.type) {
    case 'captcha':
      return (
        <Captcha
          placeholder={opts.label}
          onClick={opts.onClick}
          icon={opts.icon}
        />
      )
    case 'text':
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />
      )
    case 'password':
      return (
        <Input prefix={<Icon type={opts.icon} style={{ fontSize: 13 }} />} type={opts.type} placeholder={opts.label} />
      )
  }
}

const createFormItem = (opts) => {
  let rules = []
  if (opts.require) {
    rules.push({required: true, message: `请输入${opts.label}`})
  }
  if (opts.validator) {
    rules.push({ validator: opts.validator })
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
  if (opts.phone) {
    rules.push({ pattern: /^1[34578][0-9]{9}$/, message: '请输入正确的手机格式' })
  }
  return opts.getFieldDecorator(opts.name, {
    rules: rules,
  })(createInput(opts))
}

class VerifyForm extends Component {

  onClick = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onClick(values)
      }
    })
  }

  onCodeClick = () => {
    const me = this
    return new Promise(function (resolve, reject) {
      me.props.form.validateFields(['loginName', 'phone'], (err, values) => {
        if (!err) {
          me.props.code({
            ...values,
            codeType: 'f',
          }).then((isSuccess) => {
            resolve(isSuccess)
          })
        } else {
          resolve(false)
        }
      })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { onClick } = this.props
    return (
      <Form onSubmit={this.handleSubmit} className="fp-form">
        <FormItem>
          {createFormItem({
            getFieldDecorator: getFieldDecorator,
            require: true,
            icon: 'user',
            type: 'text',
            label: '账号',
            name: 'loginName',
          })}
        </FormItem>
        <FormItem>
          {
            createFormItem({
              getFieldDecorator: getFieldDecorator,
              require: true,
              icon: 'phone',
              type: 'captcha',
              label: '手机号',
              name: 'phone',
              onClick: this.onCodeClick.bind(this),
              phone: true,
            })
          }
        </FormItem>
        <FormItem>
          {createFormItem({
            getFieldDecorator: getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'text',
            label: '验证码',
            name: 'code',
            max: 6,
          })}
        </FormItem>
        <FormItem>
          <Button type="primary" className="fp-form-button" onClick={::this.onClick} loading={this.props.loading}>
            确定
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const WrappedVerifyForm = Form.create()(VerifyForm)

class SetForm extends Component {

  onClick = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onClick({
          ...values,
          identity: this.props.identity,
        })
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { onClick } = this.props
    return (
      <Form onSubmit={this.handleSubmit} className="fp-form">
        <FormItem>
          {createFormItem({
            getFieldDecorator: getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'password',
            label: '密码',
            name: 'newPassword',
            'min': 6,
            'max': 20,
            pattern: /^[0-9a-zA-Z]*$/,
            patternMsg: '密码只能是数字或英文大小写',
            'validator': (rule, value, callback) => {
              const form = this.props.form
              if (value && form.getFieldValue('pwdConfirm')) {
                form.validateFields(['pwdConfirm'], { force: true })
              }
              callback()
            },
          })}
        </FormItem>
        <FormItem>
          {createFormItem({
            getFieldDecorator: getFieldDecorator,
            require: true,
            icon: 'lock',
            type: 'password',
            label: '密码确认',
            name: 'pwdConfirm',
            'min': 6,
            'max': 20,
            'validator': (rule, value, callback) => {
              const form = this.props.form
              if (value && value !== form.getFieldValue('newPassword')) {
                callback('两次密码输入不一致')
              } else {
                callback()
              }
            },
          })}
        </FormItem>
        <FormItem>
          <Button type="primary" className="fp-form-button" onClick={::this.onClick} loading={this.props.loading}>
            确定
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedSetForm = Form.create()(SetForm)

class LoginForm extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { onClick } = this.props
    return (
      <Form onSubmit={this.handleSubmit} className="fp-form">
        <FormItem>
          <div>密码设置成功！</div>
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="fp-form-button" onClick={onClick}>
            <Link to="/SignIn">去登录</Link>
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm)

const steps = [{
  title: '身份验证',
}, {
  title: '设置密码',
}, {
  title: '完成',
}]

class View extends Component {

  verify (values) {
    this.props.verify(values)
  }

  setPwd (values) {
    this.props.set({
      ...values,
      identity: this.props.identity,
    })
  }

  login () {
    this.props.login(0)
  }

  render () {
    const {
      current,
      code,
      verifyLoading,
      setLoading,
    } = this.props
    return (
      <Layout className="layout">
        <Header className="flex flex-js xg-header">
          <div className="logo-wrapper flex flex-c">
            <img src="/logo-w.png" style={{ width: 70 }} />
            <div>
              <div className="logo-title">新辰产业园</div>
              <div className="logo-text">园区管理系统</div>
            </div>
          </div>
          <div className="header-link"><Link to="/SignIn">登录</Link></div>
        </Header>
        <Content className="flex flex-v flex-c">
          <Steps className="fp-steps" current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content flex flex-c flex-a">{
            current === 0 &&
              <WrappedVerifyForm onClick={::this.verify} code={code} loading={verifyLoading} />
          }{
            current === 1 && <WrappedSetForm onClick={::this.setPwd} loading={setLoading} />
          }{
            current === 2 && <WrappedLoginForm onClick={::this.login} />
          }</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          copyright &copy; 产业互联技术中心
        </Footer>
      </Layout>
    )
  }
}

export default View
