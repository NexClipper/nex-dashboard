import React, { useState, useEffect, useCallback } from 'react'
import { Breadcrumb, Skeleton, Typography, Empty, Tag } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ColumnProps } from 'antd/es/table'
import useInterval from '../utils/useInterval'
import { getClusters } from '../apis/clusters'
import { getSummaryClusters } from '../apis/summary'
import TableContainer from '../components/TableContainer'

const { Title } = Typography

const FullLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`

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

const ClusterList = () => {
  const [clustersData, setClustersData] = useState<any[] | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)

  const clusterColumns: ColumnProps<Idata>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (value, _, index) =>
        clustersData ? (
          <Link to={`/clusters/${clustersData[index].id}`}>{value}</Link>
        ) : null,
      align: 'center'
    },
    {
      title: 'Kubernetes',
      dataIndex: 'kubernetes',
      key: 'kubernetes',
      render: kubernetes => (
        <span>
          {kubernetes ? (
            <Tag color="#2ecc71">Yes</Tag>
          ) : (
            <Tag color="#e67e22">No</Tag>
          )}
        </span>
      ),
      align: 'center'
    },
    {
      title: 'node_cpu_load_avg_1',
      dataIndex: 'node_cpu_load_avg_1',
      key: 'node_cpu_load_avg_1',
      align: 'center',
      render: load => `${load} %`
    },
    {
      title: 'node_cpu_load_avg_5',
      dataIndex: 'node_cpu_load_avg_5',
      key: 'node_cpu_load_avg_5',
      align: 'center',
      render: load => `${load} %`
    },
    {
      title: 'node_cpu_load_avg_15',
      dataIndex: 'node_cpu_load_avg_15',
      key: 'node_cpu_load_avg_15',
      align: 'center',
      render: load => `${load} %`
    },
    {
      title: 'node_memory_total',
      dataIndex: 'node_memory_total',
      key: 'node_memory_total',
      align: 'center',
      render: total => `${Math.round(total / 1024 / 1024 / 1024)} GB`
    },
    {
      title: 'node_memory_available',
      dataIndex: 'node_memory_available',
      key: 'node_memory_available',
      align: 'center',
      render: available => `${Math.round(available / 1024 / 1024 / 1024)} GB`
    },
    {
      title: 'node_memory_used',
      dataIndex: 'node_memory_used',
      key: 'node_memory_used',
      align: 'center',
      render: used => `${Math.round(used / 1024 / 1024 / 1024)} GB`
    }
  ]

  const fetchClusters = useCallback(async () => {
    try {
      const { data: ClustersResponse } = await getClusters()
      const { data: ClustersSummaryResponse } = await getSummaryClusters()
      let clustersData: any[] = []
      clustersData = ClustersResponse.map(item =>
        item
          ? {
              ...item,
              ...Object.values(ClustersSummaryResponse).slice(0)[
                Object.keys(ClustersSummaryResponse)
                  .slice(0)
                  .indexOf(item.name)
              ]
            }
          : null
      )
      setClustersData(clustersData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClusters()
  }, [])

  useInterval(() => {
    !loading && !error ? fetchClusters() : console.log('')
  }, 5000)
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
          <Title level={2}>Cluster List</Title>
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

export default ClusterList
