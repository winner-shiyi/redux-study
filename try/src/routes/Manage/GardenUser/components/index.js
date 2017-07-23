import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ListPage from '../../../../components/ListPage'
import './style.scss'
import {
  Link
} from 'react-router'

class View extends Component {

  edit (record, index) {
    record.roleId = record.roleIdList[0]
    this.props.detail(record)
    this.props.edit(record)
    this.props.roleSearch()
    // this.props.gardenSearch({
    //   pageSize: 10,
    //   pageNo: (+this.props.garden.pageNo || 0) + 1,
    // })
  }

  delete (record, index) {
    this.props.del()
  }

  active (record) {
    this.props.active(record).then(() => {
      this.props.search({
        ...this.props.searchParams,
        pageNo: 1,
        pageSize: 10,
      })
    })
  }

  resetPwd (record, index) {
    this.props.resetPwd(record).then((text) => {
      Modal.success({
        content: (
          <div>
            <h3 className="new-pwd-title">重置成功，新密码为</h3>
            <h2 className="new-pwd">{text}</h2>
          </div>
        ),
        onOk () {},
      })
    })
  }

  componentDidMount () {
    this.props.search({
      ...this.props.searchParams,
      ...this.props.page,
    })
  }

  render () {
    const {
      activeFormField,
      permission,
      record,
      garden,
      gardenSearch,
      isEdit,
      changeRecord,
    } = this.props

    if (!isEdit) {
      const gardenFld = activeFormField.find((f) => {
        return f.name === 'gardenId'
      })
      gardenFld.page = garden
      gardenFld.action = gardenSearch
    }

    const columns = [{
      title: '所属园区',
      dataIndex: 'gardenId',
      key: 'gardenId',
      search: true,
      type: 'select',
      valueName: 'id',
      displayName: 'name',
      hidden: true,
      page: garden,
      action: gardenSearch,
    }, {
      title: '所属园区',
      dataIndex: 'officeName',
      key: 'officeName',
    }, {
      title: '账号类型',
      dataIndex: 'accountPropName',
      key: 'accountPropName',
    }, {
      title: '角色权限',
      dataIndex: 'roleNames',
      key: 'roleNames',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      search: true,
      max: 20,
    }, {
      title: '账号',
      dataIndex: 'loginName',
      key: 'loginName',
      // render: text => <Link to="/Manage/UserDetail">{text}</Link>,
      search: true,
      max: 50,
    }, {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      search: true,
      max: 11,
    }, {
      title: '账号状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      search: true,
      type: 'select',
      data: [['1', '冻结'], ['0', '正常']],
      hidden: true,
    }, {
      title: '账号状态',
      dataIndex: 'accountStatusName',
      key: 'accountStatusName',
    }, {
      title: '操作',
      key: 'action',
      // width: 360,
      render: (text, record, index) => (
        <span>
          {
            permission.update &&
            <Button type="primary" onClick={this.edit.bind(this, record, index)}>修改</Button>
          }
          {
            permission.lock && record.accountStatus === '1' &&
            <Button type="secondary" onClick={
              (() => {
                Modal.confirm({
                  title: '确定要启用该账号吗？',
                  onOk: (() => {
                    this.active(record, index)
                  }).bind(this),
                  onCancel () {},
                })
              }).bind(this)
            }>启用</Button>
          }
          {
            permission.lock && record.accountStatus === '0' &&
            <Button type="secondary" onClick={
              (() => {
                Modal.confirm({
                  title: '确定要冻结该账号吗？',
                  onOk: (() => {
                    this.active(record, index)
                  }).bind(this),
                  onCancel() {},
                })
              }).bind(this)
            }>冻结</Button>
          }
          {
            permission.reset &&
            <Button type="secondary" onClick={
              (() => {
                Modal.confirm({
                  title: '确定要重置密码吗？',
                  content: '重置后使用原密码将无法登录',
                  onOk: (() => {
                    this.resetPwd(record, index)
                  }).bind(this),
                  onCancel () {},
                })
              }).bind(this)
            }>重置密码</Button>
          }
        </span>
      ),
    }]

    const buttons = [{
      label: '新增账号',
      hidden: !permission.create,
      onClick: () => {
        this.props.add()
        this.props.roleSearch()
      },
    }]

    const tableOpts = {
    }


    return (

      <ListPage
        {...this.props}
        title="园区账号管理"
        name="账号"
        columns={columns}
        fields={activeFormField}
        tableOpts={tableOpts}
        buttons={buttons}
        permission={permission}
        record={record}
        formWidth={645}
        changeRecord={changeRecord}
      />
    )
  }
}

export default View
