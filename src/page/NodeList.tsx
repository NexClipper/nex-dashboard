import React, { useState, useEffect, useCallback } from 'react'
import {
  Typography,
  Row,
  Col,
  Card,
  Tag,
  Breadcrumb,
  Skeleton,
  Empty
} from 'antd'
import styled from 'styled-components'
import { Link, useRouteMatch } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../components/TableContainer'
import { getClusterNodes, IclusterNodesData } from '../apis/clusters'
import useInterval from '../utils/useInterval'
import { getSummaryClusterNodes } from '../apis/summary'

const { Title } = Typography

const StatusBox = styled(Card)`
  &.ant-card.statusBox {
    height: 300px;
    box-sizing: border-box;
    color: #fff;
    text-align: center;
    padding: 32px;
    background-color: ${props => props.color || '#0288d1'};
    font-size: 24px;
  }
  .title {
    line-height: 1.25;
    height: 72px;
    margin-bottom: 16px;
  }
  .number {
    font-size: 64px;
    margin: 0;
  }
`

const MarginRow = styled(Row)`
  margin-bottom: 16px;
`
interface Iparams {
  clusterId: string | undefined
}

const NodeList = () => {
  const match = useRouteMatch<Iparams>('/clusters/:clusterId/nodes')
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const columns: ColumnProps<ItableColumns>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (value, _, index) =>
        match && data ? (
          <Link
            to={`/clusters/${match.params.clusterId}/nodes/${data[index].id}`}
          >
            {value}
          </Link>
        ) : null,
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
      if (match) {
        const {
          data: {
            data: { data: nodesResponse }
          }
        } = await getClusterNodes(Number(match.params.clusterId))
        const { data: summaryResponse } = await getSummaryClusterNodes(
          Number(match.params.clusterId)
        )
        let clustersData: any[] = []
        clustersData = nodesResponse.map(item =>
          item
            ? {
                ...item,
                ...Object.values(summaryResponse).slice(0)[
                  Object.keys(summaryResponse)
                    .slice(0)
                    .indexOf(item.host)
                ]
              }
            : null
        )
        setData(clustersData)
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  useInterval(() => {
    !loading && !error ? fetchData() : console.log('')
  }, 5000)

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
            <Breadcrumb.Item>
              <Link to="/clusters">Cluster List</Link>
            </Breadcrumb.Item>
            {match ? (
              <Breadcrumb.Item>
                <Link to={`/clusters/${match.params.clusterId}`}>
                  Clutser Name
                </Link>
              </Breadcrumb.Item>
            ) : null}
            <Breadcrumb.Item>Node List</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>Node</Title>
          {/* <MarginRow gutter={16}>
          <Col span={4}>
            <StatusBox className="statusBox">
              <p className="title">Disk Pressure</p>
              <p className="number">0</p>
            </StatusBox>
          </Col>
          <Col span={4}>
            <StatusBox className="statusBox">
              <p className="title">Memory Pressure</p>
              <p className="number">0</p>
            </StatusBox>
          </Col>
          <Col span={4}>
            <StatusBox className="statusBox">
              <p className="title">PID Pressure</p>
              <p className="number">0</p>
            </StatusBox>
          </Col>
          <Col span={4}>
            <StatusBox className="statusBox">
              <p className="title">Unschedulable</p>
              <p className="number">0</p>
            </StatusBox>
          </Col>
          <Col span={4}>
            <StatusBox color="#FB8C00" className="statusBox">
              <p className="title">Out of Disk</p>
              <p className="number">0</p>
            </StatusBox>
          </Col>
          <Col span={4}>
            <StatusBox color="#9b59b6" className="statusBox">
              <p className="title">Network Unavilable</p>
              <p className="number">0</p>
            </StatusBox>
          </Col>
        </MarginRow> */}
          {data ? (
            <TableContainer
              key="id"
              title={'Node List'}
              columns={columns}
              data={data}
            />
          ) : (
            <Empty />
          )}
        </>
      )}
    </>
  )
}

export default NodeList
