import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'
import Table1 from '../Table1'
import SearchForm1 from '../SearchForm1'
import { Link, browserHistory } from 'react-router'
import './style.scss'

export default class ListPage extends Component {
  static propTypes = {
    title: PropTypes.string,
    loading: PropTypes.bool,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array,
    search: PropTypes.func,
  }

  render () {
    const {
      title,
      loading = false,
      columns,
      data,
      search,
      changeSearch,
      searchParams,
      page,
      style,
      expandedRowRender,
      reset,
    } = this.props

    return (
      <div style={{ padding: 16, flex: 'auto', ...style }} >
        {
          (title) &&
          <Row type="flex" justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col>
              <h2 className="ant-page-title">
                {title}
              </h2>
            </Col>
            <Col>
              <Link to="/Manage/AddDistribution" className="add-btn ant-btn ant-btn-primary">新建车配任务</Link>
            </Col>
          </Row>
        }
        <SearchForm1
          fields={columns.filter(item => !!item.search)}
          search={search}
          changeSearch={changeSearch}
          searchParams={searchParams}
          page={page}
          reset={reset}
        />
        <Table1
          {...this.props}
          columns={columns.filter((item) => !item.hidden)}
          dataSource={data}
          loading={loading}
          search={search}
          expandedRowRender={expandedRowRender}
          pagination={
            page ? {
              current: page.pageNo,
              total: page.count,
              pageSize: page.pageSize || 10,
            } : null
          }
        />
      </div>
    )
  }
}
