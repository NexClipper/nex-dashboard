import React from 'react'
import { Table, Card } from 'antd'
import {
  PaginationConfig,
  SorterResult,
  ColumnProps,
  TableCurrentDataSource
} from 'antd/es/table'
import styled from 'styled-components'

const TableContent = styled(Card)`
  &.ant-card {
    margin-bottom: 16px;
  }

  .ant-table-tbody > tr {
    //background-color: #e74c3c;
    //color: #fff;
    &:hover {
      // background-color: #c0392b;
    }
  }
`

type IProps = {
  title?: string
  data: any[] | undefined
  columns: ColumnProps<any>[] | undefined
  rowKey?: string
  handleChange?: (
    pagination: PaginationConfig,
    filters: Record<string | number | symbol, string[]>,
    sorter: SorterResult<any>,
    extra: TableCurrentDataSource<any>
  ) => void
  loading?: boolean
}

function TableContainer({
  title,
  columns,
  data,
  rowKey,
  handleChange,
  loading
}: IProps) {
  return (
    <TableContent title={title ? title : undefined} bordered={false}>
      <Table
        rowKey={rowKey ? `${rowKey}` : 'id'}
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        loading={loading}
      />
    </TableContent>
  )
}

export default React.memo(TableContainer)
