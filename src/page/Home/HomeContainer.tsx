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

const HomeContainer = () => {
  const dispatch = useDispatch()
  dispatch(setCluster(1, ''))
  const [agentsData, setAgentsData] = useState<IagentsObjectData | null>(null)
  const [nodesData, setNodesData] = useState<InodesObjectData | null>(null)
  const [clustersData, setClustersData] = useState<
    IclusterListContainer[] | null
  >(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const clusterColumns: ColumnProps<IclusterListContainer>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const nameA = a.name
        const nameB = b.name
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      }
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
      setAgentsData(agentsResponse)
    } catch (error) {
      setError(error)
    }
    try {
      const { data: nodesResponse } = await getNodes()
      setNodesData(nodesResponse)
    } catch (error) {
      setError(error)
    }
    try {
      const { data: clustersResponse } = await getClusters()
      const { data: ClustersSummaryResponse } = await getSummaryClusters()
      let clustersData: IclusterListContainer[] = []
      clustersData = clustersResponse.map(
        item =>
          item && {
            ...item,
            ...values(ClustersSummaryResponse).slice(0)[
              keys(ClustersSummaryResponse)
                .slice(0)
                .indexOf(item.id.toString())
            ]
          }
      )
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
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const ipA = a.ip
        const ipB = b.ip
        if (ipA < ipB) return -1
        if (ipA > ipB) return 1
        return 0
      }
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
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const hostA = a.host
        const hostB = b.host
        if (hostA < hostB) return -1
        if (hostA > hostB) return 1
        return 0
      }
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
