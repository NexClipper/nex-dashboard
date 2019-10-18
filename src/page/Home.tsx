import React, { useState, useEffect } from 'react'
import { PaginationConfig, SorterResult, ColumnProps } from 'antd/es/table'
import styled from 'styled-components'

import { getClusters } from '../apis/clusters'
import TableContainer from '../components/TableContainer'
import Item from 'antd/lib/list/Item'

interface clustersData {
  id: string
  name: string
}

function Home() {
  const [clustersData, setClustersData] = useState(undefined)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        let response = await getClusters()
        setClustersData(response.data)
      } catch (error) {
        setError(error)
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
      <TableContainer
        title={'Clusters List'}
        columns={clustersColumns}
        data={clustersData}
      />
    </>
  )
}

export default Home
