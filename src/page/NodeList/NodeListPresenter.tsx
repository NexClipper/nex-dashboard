import React from 'react'
import { Breadcrumb, Skeleton, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'

interface Iprops {
  loading: boolean
  data: InodeListContainer[] | null
  columns: ColumnProps<ItableColumns>[]
}

const NodeListPresenter = ({ loading, data, columns }: Iprops) => {
  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Node List</Breadcrumb.Item>
          </Breadcrumb>
          <TitleContainer level={2} text={'Node List'} />
          {data ? (
            <TableContainer key="id" title={''} columns={columns} data={data} />
          ) : (
            <Empty />
          )}
        </>
      )}
    </>
  )
}

export default NodeListPresenter
