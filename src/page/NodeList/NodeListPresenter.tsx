import React from 'react'
import { Breadcrumb, Skeleton, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'

interface IclustersData {
  id: number
  host: string
  ip: string
  os: string
  node_cpu_idle: number
  node_cpu_iowait: number
  node_cpu_load_avg_1: number
  node_cpu_load_avg_15: number
  node_cpu_load_avg_5: number
  node_cpu_system: number
  node_cpu_user: number
  node_memory_available: number
  node_memory_buffers: number
  node_memory_cached: number
  node_memory_free: number
  node_memory_total: number
  node_memory_used: number
  node_memory_used_percent: number
  platform: string
  platform_family: string
  platform_version: string
  agent_id: number
}

interface Iprops {
  loading: boolean
  data: IclustersData[] | null
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
