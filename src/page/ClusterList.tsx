import React, { useState, useEffect } from 'react'
import { Breadcrumb, Skeleton, Typography, List } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useInterval from '../utils/useInterval'
import { getClusters, IclustersData } from '../apis/clusters'
import { IsummaryClustersObjectData, getSummaryClusters } from '../apis/summary'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../components/TableContainer'

const { Title } = Typography

const FullLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`

interface ItestData {
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
  const [clustersData, setClustersData] = useState<IclustersData[] | null>(null)
  const [
    clusterSummaryData,
    setClusterSummaryData
  ] = useState<IsummaryClustersObjectData | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchClusters = async () => {
    try {
      const { data: ClustersResponse } = await getClusters()
      const { data: ClustersSummaryResponse } = await getSummaryClusters()
      const objectValue = Object.values(ClustersSummaryResponse)
      const clustersData = ClustersResponse.map((item, index) =>
        item ? { ...item, ...objectValue[index] } : objectValue[index]
      )
      console.log(clustersData)
      setClustersData(ClustersResponse)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClusters()
  }, [])

  useInterval(() => {
    !loading && !error ? fetchClusters() : console.log('')
  }, 1000)
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
            <List
              size="large"
              bordered
              dataSource={clustersData}
              renderItem={item => (
                <List.Item>
                  <FullLink to={`clusters/${item.id}`}>{item.name}</FullLink>
                </List.Item>
              )}
            />
          ) : null}
        </>
      )}
    </>
  )
}

export default ClusterList
