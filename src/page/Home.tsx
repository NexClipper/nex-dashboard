import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton, Tag, Typography, Empty } from 'antd'

import { getAgents } from '../apis/agents'
import TableContainer from '../components/TableContainer'
import { getNodes } from '../apis/nodes'
import useInterval from '../utils/useInterval'

const { Title } = Typography

function Home() {
  const [agentsData, setAgentsData] = useState({})
  const [nodesData, setNodesData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchClusters = async () => {
    try {
      const agentsResponse = await getAgents()
      const nodesResponse = await getNodes()
      setAgentsData(agentsResponse.data)
      setNodesData(nodesResponse.data)
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
    !loading && !error ? fetchClusters() : console.log('loading failure')
  }, 1000)

  const agentsColumns: ColumnProps<IagentListData>[] = [
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip'
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
      )
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version'
    }
  ]

  const nodesColumns: ColumnProps<InodelistData>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host'
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: 'OS',
      dataIndex: 'os',
      key: 'os'
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform'
    },
    {
      title: 'Platform Family',
      dataIndex: 'platform_family',
      key: 'platform_family'
    },
    {
      title: 'Platform Version',
      dataIndex: 'platform_version',
      key: 'platform_version'
    },
    {
      title: 'Agent ID',
      dataIndex: 'agent_id',
      key: 'agent_id'
    }
  ]

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Title level={2}>Agent List</Title>
          {Object.keys(agentsData).length !== 0 ? (
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
          {Object.keys(nodesData).length !== 0 ? (
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
