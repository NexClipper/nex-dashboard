import React, { useState, useEffect } from 'react'
import { Breadcrumb, Skeleton, Typography, List } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useInterval from '../utils/useInterval'
import { getClusters, IclustersData } from '../apis/clusters'

const { Title } = Typography

const FullLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`

const ClusterList = () => {
  const [clustersData, setClustersData] = useState<IclustersData[] | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchClusters = async () => {
    try {
      const { data: ClustersResponse } = await getClusters()
      setClustersData(ClustersResponse)
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
  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Cluster List</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>Cluster List</Title>
          {clustersData ? (
            <List
              size="large"
              bordered
              dataSource={clustersData}
              renderItem={item => (
                <List.Item>
                  <FullLink to={`clusters/${item.id}`}>{item.name}</FullLink>
                </List.Item>
              )}
            />
          ) : null}
        </>
      )}
    </>
  )
}

export default ClusterList
