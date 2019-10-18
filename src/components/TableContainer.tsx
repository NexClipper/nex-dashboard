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
`

interface IProps {
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

const TableContainer: React.FC<IProps> = ({
  title,
  columns,
  data,
  handleChange
}) => {
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
