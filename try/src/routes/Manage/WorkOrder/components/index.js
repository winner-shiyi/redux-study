import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import ListPage from '../../../../components/ListPage'

class View extends Component {
  componentDidMount () {
    this.props.gardenSearch({
      pageNo: '1',
      pageSize: '100000',
    }).then(() => {
      this.props.search({
        ...this.props.searchParams,
        ...this.props.page,
      })
    })
  }

  edit (record, index) {
    this.props.edit(record)
  }

  render () {
    const {
      permission,
      add,
      garden,
      isEdit,
    } = this.props

    const columns = [
      {
        label: '所属园区',
        name: 'gardenId',
        search: true,
        type: 'select',
        required: true,
        data: garden.data,
        valueName: 'id',
        displayName: 'name',
        hidden: true,
      }, {
        label: '所属园区',
        name: 'gardenName',
      }, {
        label: '工单编号',
        name: 'repairNo',
        search: true,
        max: 20,
      }, {
        label: '提交人',
        name: 'createBy',
      }, {
        label: '提交时间',
        name: 'createDate',
      }, {
        label: '工单状态',
        name: 'status',
        search: true,
        type: 'select',
        data: [[0, '待修'], [1, '已修'], [2, '废单']],
        hidden: true,
      }, {
        label: '工单状态',
        name: 'statusName',
      }, {
        label: '维修位置',
        name: 'position',
      }, {
        label: '损坏描述',
        name: 'description',
        className: 'column-l',
        width: '300px',
        render: function (text, record) {
          return (
            <div
              style={{ textAlign: 'left' }}
              dangerouslySetInnerHTML={{ __html: text.replace(/[\r\n]/g, '<br />') }} />
          )
        },
      }, {
        label: '报修人',
        name: 'contactPerson',
        search: true,
        max: 20,
      }, {
        label: '报修人电话',
        name: 'contactPhone',
        search: true,
        max: 11,
        number: true,
      }, {
        label: '维修人',
        name: 'repairPerson',
        search: true,
        max: 20,
      }, {
        label: '维修人电话',
        name: 'repairPhone',
        search: true,
        max: 11,
        number: true,
      }, {
        label: '操作',
        name: 'action',
        width: '180px',
        render: (text, record, index) => (
          <span>
            {
              <Button type="primary" onClick={this.edit.bind(this, record, index)}>修改</Button>
            }
            {
              record.status == '0' &&
              <Button type="secondary" onClick={
                (() => {
                  Modal.confirm({
                    title: '确定要将该工单设为已修吗？',
                    onOk: (() => {
                      this.props.setStatus(record, index).then((success) => {
                        success && this.props.search({
                          ...this.props.searchParams,
                          ...this.props.page,
                        })
                      })
                    }).bind(this),
                    onCancel () {},
                  })
                }).bind(this)
              }>设为已修</Button>
            }
          </span>
        ),
      },
    ]

    const fields = [
      {
        label: '所属园区',
        name: 'gardenId',
        type: 'select',
        data: garden.data,
        valueName: 'id',
        displayName: 'name',
        required: true,
        simple: true,
        disabled: isEdit,
      },
      {
        label: '工单编号',
        name: 'repairNo',
        disabled: true,
        hidden: !isEdit,
        simple: true,
      },
      {
        label: '维修位置',
        name: 'position',
        required: true,
        simple: true,
        max: 20,
      }, {
        label: '损坏描述',
        name: 'description',
        type: 'textarea',
        required: true,
        simple: true,
        max: 200,
      }, {
        label: '工单状态',
        name: 'status',
        type: 'select',
        required: true,
        simple: true,
        data: [[0, '待修'], [1, '已修'], [2, '废单']],
      }, {
        label: '报修人',
        name: 'contactPerson',
        required: true,
        simple: true,
        max: 20,
      }, {
        label: '报修人电话',
        name: 'contactPhone',
        required: true,
        phone: true,
        simple: true,
      }, {
        label: '维修人',
        name: 'repairPerson',
        simple: true,
        max: 20,
      }, {
        label: '维修人电话',
        name: 'repairPhone',
        simple: true,
        phone: true,
      },
    ]

    const buttons = [
      {
        label: '新增工单',
        onClick: () => {
          add()
        },
      },
    ]

    return (
      <ListPage
        {...this.props}
        columns={columns}
        fields={fields}
        buttons={buttons}
        formWidth={600}
      />
    )
  }
}

export default View
