import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton, Tag } from 'antd'

import { getAgents } from '../apis/agents'
import TableContainer from '../components/TableContainer'

interface agentsData {
  id: number
  ip: string
  online: boolean
  version: string
}

function Home() {
  const [data, setData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        let response = await getAgents()
        setData(response.data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchClusters()
  }, [])

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

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <div>
          {Object.entries(data).map(([title, value]: [string, any]) => {
            return (
              <TableContainer
                title={title}
                columns={agentsColumns}
                data={value}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default Home
