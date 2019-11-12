import React, { useState, useEffect, useCallback } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Tag } from 'antd'
import { useDispatch } from 'react-redux'
import values from 'lodash-es/values'
import keys from 'lodash-es/keys'
import { setCluster } from '../../reducers/cluster'
import { getAgents, IagentsObjectData } from '../../apis/agents'
import { getNodes, InodesObjectData } from '../../apis/nodes'
import useInterval from '../../utils/useInterval'
import { getClusters } from '../../apis/clusters'
import { getSummaryClusters } from '../../apis/summary'
import HomePresenter from './HomePresenter'

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

const HomeContainer = () => {
  const dispatch = useDispatch()
  dispatch(setCluster(1, ''))
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

  const fetchData = useCallback(async () => {
    try {
      const { data: agentsResponse } = await getAgents()
      const { data: nodesResponse } = await getNodes()
      const { data: clustersResponse } = await getClusters()
      const { data: ClustersSummaryResponse } = await getSummaryClusters()
      let clustersData: any[] = []
      clustersData = clustersResponse.map(
        item =>
          item && {
            ...item,
            ...values(ClustersSummaryResponse).slice(0)[
              keys(ClustersSummaryResponse)
                .slice(0)
                .indexOf(item.name)
            ]
          }
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
    fetchData()
  }, [])

  useInterval(() => (!loading && !error ? fetchData() : null), 10000)

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
    <HomePresenter
      loading={loading}
      clustersData={clustersData}
      clusterColumns={clusterColumns}
      nodesData={nodesData}
      nodesColumns={nodesColumns}
      agentsData={agentsData}
      agentsColumns={agentsColumns}
    />
  )
}

export default HomeContainer
