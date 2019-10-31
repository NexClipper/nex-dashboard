import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton, Tag, Typography, Empty, Breadcrumb } from 'antd'

import { getAgents, IagentsObjectData } from '../apis/agents'
import TableContainer from '../components/TableContainer'
import { getNodes, InodesObjectData } from '../apis/nodes'
import useInterval from '../utils/useInterval'

const { Title } = Typography

const Home = () => {
  const [agentsData, setAgentsData] = useState<IagentsObjectData | null>(null)
  const [nodesData, setNodesData] = useState<InodesObjectData | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchClusters = async () => {
    try {
      const { data: agentsResponse } = await getAgents()
      const { data: nodesResponse } = await getNodes()
      setAgentsData(agentsResponse)
      setNodesData(nodesResponse)
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
      key: 'platform_family'
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
          <Title level={2}>Agent List</Title>
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
          <Title level={2}>Node list</Title>
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
        </>
      )}
    </>
  )
}

export default Home
