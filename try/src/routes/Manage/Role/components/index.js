import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ListPage from '../../../../components/ListPage'
import {
  Link
} from 'react-router'

class View extends Component {

  edit (record, index) {
    this.props.edit(record)
  }

  view (record, index) {
    this.props.view(record)
  }

  componentDidMount () {
    this.props.search(this.props.page)
  }

  render () {
    const {
      formFields,
      permission,
      formTitle,
    } = this.props

    const columns = [{
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'action',
      width: 360,
      render: (text, record, index) => (
        <span>
          {
            permission.update &&
            <Button type="primary" onClick={this.edit.bind(this, record, index)}>配置权限</Button>
          }
          {
            permission.active && record.status === '0' &&
            <Button type="secondary" onClick={
              (() => {
                Modal.confirm({
                  title: '确定要启用该角色吗？',
                  onOk: (() => {
                    //this.active(record, index)
                  }).bind(this),
                  onCancel() {},
                })
              }).bind(this)
            }>启用</Button>
          }
          {
            permission.lock && record.status === '1' &&
            <Button type="secondary" onClick={
              (() => {
                Modal.confirm({
                  title: '确定要冻结该角色吗？',
                  onOk: (() => {
                    //this.lock(record, index)
                  }).bind(this),
                  onCancel() {},
                })
              }).bind(this)
            }>冻结</Button>
          }
          <Button type="secondary" onClick={this.view.bind(this, record, index)}>查看权限</Button>
        </span>
      ),
    }]

    const buttons = [{
      'label': '新增角色',
      hidden: !permission.create,
      'onClick': () => {
        this.props.add()
      },
    }]

    const createFormFields = (data) => {
      return data.map((item, index) => {
        let options = item.children.map((item) => {
          return {
            label: item.name,
            value: item.id,
          }
        })
        return {
          label: item.name,
          type: 'checkboxGroup',
          disabled: this.props.isView,
          name: item.parentIds + item.id + ',',
          options: options,
        }
      })
    }

    return (
      <ListPage
        {...this.props}
        title="角色权限管理"
        name="角色"
        columns={columns}
        fields={formFields.concat(createFormFields(this.props.leafMenuData))}
        buttons={buttons}
        noSearch={true}
        cusTitle={formTitle}
      />
    )
  }
}

export default View
