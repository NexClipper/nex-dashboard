import React, { useState } from 'react'
import { PaginationConfig, SorterResult, ColumnProps } from 'antd/es/table'
import styled from 'styled-components'

import TableContainer from '../components/TableContainer'

interface Isorted {
  order?: boolean | 'descend' | 'ascend'
  columnKey?: string
}

interface HumanData {
  key: string
  name: string
  age: number
  address: string
}
const data: HumanData[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park'
  }
]

const Home: React.FC = () => {
  const [sortedInfo, setSortedInfo] = useState<Isorted>({})
  const [filteredInfo, setFilteredInfo] = useState<
    Record<'name' | 'address' | 'age' | 'key', string[]>
  >({
    name: [],
    address: [],
    age: [],
    key: []
  })
  const columns: ColumnProps<HumanData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }],
      filteredValue: [filteredInfo.name] || null,
      onFilter: (value: string, record: HumanData) =>
        record.name.includes(value),
      sorter: (a: HumanData, b: HumanData) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a: HumanData, b: HumanData) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' }
      ],
      filteredValue: [filteredInfo.address] || null,
      onFilter: (value: string, record: HumanData) =>
        record.address.includes(value),
      sorter: (a: HumanData, b: HumanData) =>
        a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order
    }
  ]

  const handleChange = (
    pagination: PaginationConfig,
    filters: Record<any, string[]>,
    sorter: SorterResult<HumanData>
  ) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter)
  }
  return (
    <>
      <TableContainer
        title={'Agent List'}
        columns={columns}
        data={data}
        handleChange={handleChange}
      />
    </>
  )
}

export default Home
