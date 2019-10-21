import React from 'react'
import { Typography, Table } from 'antd'
import {
  PaginationConfig,
  SorterResult,
  ColumnProps,
  TableCurrentDataSource
} from 'antd/es/table'
import styled from 'styled-components'

const { Title } = Typography

const TableBackground = styled.div`
  background-color: white;
`

const TitleText = styled(Title)`
  border-bottom: 1px solid #333;
  padding: 16px;
`

const TableContent = styled.div`
  padding: 16px;
  
  .ant-table-tbody > tr {
     //background-color: #e74c3c;
     //color: #fff;
     &:hover {
      // background-color: #c0392b;
     }
  }
`

type IProps = {
  title: string
  data: any[] | undefined
  columns: ColumnProps<any>[] | undefined
  handleChange?: (
    pagination: PaginationConfig,
    filters: Record<string | number | symbol, string[]>,
    sorter: SorterResult<any>,
    extra: TableCurrentDataSource<any>
  ) => void
}

function TableContainer ({
  title,
  columns,
  data,
  handleChange
}: IProps) {
  return (
    <TableBackground>
      <TitleText level={3}>{title}</TitleText>
      <TableContent>
        <Table
          rowKey={data => data.id}
          columns={columns}
          dataSource={data}
          onChange={handleChange}
        />
      </TableContent>
    </TableBackground>
  )
}

export default TableContainer
