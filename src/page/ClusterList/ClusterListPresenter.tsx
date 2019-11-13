import React from 'react'
import { Breadcrumb, Skeleton, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'

interface Idata {
  node_cpu_idle?: number
  node_cpu_iowait?: number
  node_cpu_load_avg_1?: number
  node_cpu_load_avg_15?: number
  node_cpu_load_avg_5?: number
  node_cpu_system?: number
  node_cpu_user?: number
  node_memory_available?: number
  node_memory_buffers?: number
  node_memory_cached?: number
  node_memory_free?: number
  node_memory_total?: number
  node_memory_used?: number
  node_memory_used_percent?: number
  id: number
  kubernetes: boolean
  name: string
}

interface Iprops {
  loading: boolean
  clustersData: Idata[] | null
  clusterColumns: ColumnProps<Idata>[]
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
