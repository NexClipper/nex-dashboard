import React from 'react'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'

function ClusterList() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Cluster List</Breadcrumb.Item>
      </Breadcrumb>
      <p>Cluster</p>
    </>
  )
}

export default ClusterList
