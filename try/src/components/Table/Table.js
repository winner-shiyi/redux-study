import React, { Component } from 'react'
import { Table, Spin } from 'antd'
import PropTypes from 'prop-types'

export default class CommonTable extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    rowSelection: PropTypes.object,
    pagination: PropTypes.object,
    search: PropTypes.func,
    searchParams: PropTypes.object,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    expandedRowRender: PropTypes.func,
  }

  onChange (page) {
    this.props.search({
      ...this.props.searchParams,
      pageNo: page.current,
      pageSize: page.pageSize,
    })
  }

  render () {
    const {
      loading,
      columns,
      dataSource,
      pagination,
      searchParams,
      rowSelection,
      onChange,
      bordered,
      expandedRowRender,
    } = this.props

    let mapColumns = [
      ...columns,
    ]

    mapColumns.forEach((column) => {
      if ('label' in column) {
        column.title = column.label
      }
      if ('name' in column) {
        column.key = column.dataIndex = column.name
      }
    })
              // console.log(mapColumns)

    return (
      <Spin spinning={loading}>
        <Table
          bordered={bordered}
          searchParams={searchParams}
          rowKey="id"
          style={{ marginTop: '16px' }}
          columns={mapColumns}
          dataSource={dataSource}
          pagination={
            pagination ? {
              pageSize: 10,
              ...pagination,
              showTotal: (total, range) => `显示第 ${range[0]} 到第 ${range[1]} 条记录，总共 ${total} 条记录`,
            } : false}
          onChange={onChange || ::this.onChange}
          rowSelection={rowSelection}
          expandedRowRender={expandedRowRender}
        />
      </Spin>
    )
  }
}
