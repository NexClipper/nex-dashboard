import React, { useState, useEffect, useCallback } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton, Tag, Empty, Breadcrumb } from 'antd'

import { getAgents, IagentsObjectData } from '../apis/agents'
import TableContainer from '../components/TableContainer'
import TitleContainer from '../components/TitleContainer'
import { getNodes, InodesObjectData } from '../apis/nodes'
import useInterval from '../utils/useInterval'
import { getClusters } from '../apis/clusters'
import { getSummaryClusters } from '../apis/summary'

interface IclustersData {
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

const Home = () => {
  const [agentsData, setAgentsData] = useState<IagentsObjectData | null>(null)
  const [nodesData, setNodesData] = useState<InodesObjectData | null>(null)
  const [clustersData, setClustersData] = useState<any[] | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const clusterColumns: ColumnProps<IclustersData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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

  const fetchDatas = useCallback(async () => {
    try {
      const { data: agentsResponse } = await getAgents()
      const { data: nodesResponse } = await getNodes()
      const { data: clustersResponse } = await getClusters()
      const { data: ClustersSummaryResponse } = await getSummaryClusters()
      let clustersData: any[] = []
      clustersData = clustersResponse.map(item =>
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
      setAgentsData(agentsResponse)
      setNodesData(nodesResponse)
      setClustersData(clustersData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDatas()
  }, [])

  useInterval(() => {
    !loading && !error ? fetchDatas() : console.log('')
  }, 10000)

  const agentsColumns: ColumnProps<IagentListData>[] = [
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip',
      align: 'center'
    },
    {
      title: 'Online',
      dataIndex: 'online',
      key: 'online',
      render: online => (
        <span>
          {online ? (
            <Tag color="#2ecc71">Online</Tag>
          ) : (
            <Tag color="#e67e22">Offline</Tag>
          )}
        </span>
      ),
      align: 'center'
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      align: 'center'
    }
  ]

  const nodesColumns: ColumnProps<InodelistData>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      align: 'center'
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip',
      align: 'center'
    },
    {
      title: 'OS',
      dataIndex: 'os',
      key: 'os',
      align: 'center'
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      align: 'center'
    },
    {
      title: 'Platform Family',
      dataIndex: 'platform_family',
      key: 'platform_family',
      align: 'center'
    },
    {
      title: 'Platform Version',
      dataIndex: 'platform_version',
      key: 'platform_version',
      align: 'center'
    },
    {
      title: 'Agent ID',
      dataIndex: 'agent_id',
      key: 'agent_id',
      align: 'center'
    }
  ]

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <TitleContainer level={2} text={'Cluster list'} />
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
          <TitleContainer level={2} text={'Node list'} />
          {nodesData && Object.keys(nodesData).length !== 0 ? (
            Object.entries(nodesData).map(([title, value]: [string, any]) => {
              return (
                <TableContainer
                  key={value}
                  title={title}
                  columns={nodesColumns}
                  data={value}
                />
              )
            })
          ) : (
            <Empty />
          )}
          <TitleContainer level={2} text={'Agent List'} />
          {agentsData && Object.keys(agentsData).length !== 0 ? (
            Object.entries(agentsData).map(([title, value]: [string, any]) => {
              return (
                <TableContainer
                  key={value}
                  title={title}
                  columns={agentsColumns}
                  data={value}
                />
              )
            })
          ) : (
            <Empty />
          )}
        </>
      )}
    </>
  )
}

export default Home
