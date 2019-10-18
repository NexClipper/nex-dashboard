import React, { useState, useEffect } from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton } from 'antd'

import { getClusters } from '../apis/clusters'
import TableContainer from '../components/TableContainer'

interface clustersData {
  id: string
  name: string
}

function Home() {
  const [clustersData, setClustersData] = useState(undefined)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        let response = await getClusters()
        setClustersData(response.data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchClusters()
  }, [])

  const clustersColumns: ColumnProps<clustersData>[] = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    }
  ]

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <TableContainer
          title={'Clusters List'}
          columns={clustersColumns}
          data={clustersData}
        />
      )}
    </>
  )
}

export default Home
