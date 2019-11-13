import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import values from 'lodash-es/values'
import keys from 'lodash-es/keys'
import { RootState } from '../../reducers'
import { ColumnProps } from 'antd/es/table'
import NodeListPresenter from './NodeListPresenter'
import { getClusterNodes, getClusters } from '../../apis/clusters'
import useInterval from '../../utils/useInterval'
import { getSummaryClusterNodes } from '../../apis/summary'
import { logger } from '../../utils/logger'

const NodeListContainer = () => {
  const selectedClusterId = useSelector((state: RootState) => state.cluster.id)
  const [data, setData] = useState<InodeListContainer[] | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const columns: ColumnProps<ItableColumns>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (value, _, index) =>
        data && <Link to={`/nodes/${data[index].id}`}>{value}</Link>,
      align: 'center'
    },
    {
      title: 'IP',
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
      key: 'platform_version'
    },
    {
      title: 'Agent ID',
      dataIndex: 'agent_id',
      key: 'agent_id',
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
      title: 'node_memory_used',
      dataIndex: 'node_memory_used',
      key: 'node_memory_used',
      align: 'center',
      render: used => `${Math.round(used / 1024 / 1024 / 1024)} GB`
    }
  ]

  const fetchData = useCallback(async () => {
    try {
      const {
        data: {
          data: { data: nodesResponse }
        }
      } = await getClusterNodes(selectedClusterId)
      const { data: summaryResponse } = await getSummaryClusterNodes(
        selectedClusterId
      )
      let clustersData: any[] = []
      clustersData = nodesResponse.map(
        item =>
          item && {
            ...item,
            ...values(summaryResponse).slice(0)[
              keys(summaryResponse)
                .slice(0)
                .indexOf(item.host)
            ]
          }
      )
      setData(clustersData)
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
  return <NodeListPresenter loading={loading} data={data} columns={columns} />
}

export default NodeListContainer
