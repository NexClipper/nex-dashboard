import React, { useState } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton, Tag, Typography } from 'antd'

import { getAgents } from '../apis/agents'
import TableContainer from '../components/TableContainer'
import { getNodes } from '../apis/nodes'
import useInterval from '../utils/useInterval'

const { Title } = Typography

type agentsData = {
  id: number
  ip: string
  online: boolean
  version: string
}

type nodesData = {
  id: number
  host: string
  ip: string
  os: string
  platform: string
  platform_family: string
  platform_version: string
  agent_id: number
}

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

  useInterval(() => {
    fetchClusters()
  }, 1000)

  const agentsColumns: ColumnProps<agentsData>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
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
            <Tag color="green">Online</Tag>
          ) : (
            <Tag color="black">Offline</Tag>
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

  const nodesColumns: ColumnProps<nodesData>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
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
          {Object.entries(agentsData).map(([title, value]: [string, any]) => {
            return (
              <TableContainer
                key={value}
                title={title}
                columns={agentsColumns}
                data={value}
              />
            )
          })}
          <Title level={2}>Node list</Title>
          {Object.entries(nodesData).map(([title, value]: [string, any]) => {
            return (
              <TableContainer
                key={value}
                title={title}
                columns={nodesColumns}
                data={value}
              />
            )
          })}
        </>
      )}
    </>
  )
}

export default Home
