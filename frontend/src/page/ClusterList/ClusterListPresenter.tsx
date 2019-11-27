import React from 'react'
import { Breadcrumb, Skeleton, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'

interface Iprops {
  loading: boolean
  clustersData: IclusterListContainer[] | null
  clusterColumns: ColumnProps<IclusterListContainer>[]
}

const ClusterListPresenter = ({
  loading,
  clustersData,
  clusterColumns
}: Iprops) => {
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
            <Breadcrumb.Item>Cluster List</Breadcrumb.Item>
          </Breadcrumb>
          <TitleContainer level={2} text={'Cluster List'} />
          {clustersData ? (
            <TableContainer
              key="id"
              title={''}
              columns={clusterColumns}
              data={clustersData}
            />
          ) : (
            <Empty />
          )}
        </>
      )}
    </>
  )
}

export default ClusterListPresenter
