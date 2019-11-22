import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import values from 'lodash-es/values'
import keys from 'lodash-es/keys'
import { Tag } from 'antd'
import { ColumnProps } from 'antd/es/table'
import useInterval from '../../utils/useInterval'
import { getClusters } from '../../apis/clusters'
import { getSummaryClusters } from '../../apis/summary'
import ClusterListPresenter from './ClusterListPresenter'
import { clusterStroe } from '../../store'

const ClusterListContainer = () => {
  clusterStroe.setCluster(1, '')
  const [clustersData, setClustersData] = useState<
    IclusterListContainer[] | null
  >(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)

  const clusterColumns: ColumnProps<IclusterListContainer>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: value =>
        clustersData && (
          <Link
            to={`/clusters/${
              clustersData.filter(item => item.name === value)[0].id
            }`}
          >
            {value}
          </Link>
        ),
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

  const fetchClusters = useCallback(async () => {
    try {
      const { data: ClustersResponse } = await getClusters()
      const { data: ClustersSummaryResponse } = await getSummaryClusters()
      let clustersData: IclusterListContainer[] = []
      clustersData = ClustersResponse.map(
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
    fetchClusters()
  }, [])

  useInterval(() => (!loading && !error ? fetchClusters() : null), 10000)
  return (
    <ClusterListPresenter
      loading={loading}
      clustersData={clustersData}
      clusterColumns={clusterColumns}
    />
  )
}

export default ClusterListContainer
