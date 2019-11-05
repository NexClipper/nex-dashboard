import React, { useState, useEffect, useCallback } from 'react'
import {
  Breadcrumb,
  Row,
  Col,
  Card,
  Tag,
  Progress,
  Input,
  Skeleton,
  Empty
} from 'antd'
import { Link, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ColumnProps } from 'antd/es/table'
import { OpUnitType } from 'dayjs'
import LineChart from '../components/LineChart'
import TableContainer from '../components/TableContainer'
import TitleContainer from '../components/TitleContainer'
import SelectDate from '../components/SelectDate'
import {
  IsnapshotNodeObjectData,
  getSnapshotNode,
  getSnapshotNodeContainers,
  IsnapshotNodeContainerObjectData,
  IsnapshotNodeProcessObjectData,
  getSnapshotNodeProcesses
} from '../apis/snapshot'
import { getMetricsNode } from '../apis/metrics'
import useInterval from '../utils/useInterval'

dayjs.extend(utc)

const { Search } = Input

const CropTag = styled(Tag)`
  &.ant-tag {
    max-width: 300px;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`

const FixedBox = styled.div`
  height: 365px;
  .scrollBox {
    overflow: auto;
  }
`

const MarginRow = styled(Row)`
  margin-top: 16px;
`

const ChartTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 32px;
  padding-bottom: 16px;
  .ant-typography {
    margin: 0;
  }
`

interface Iparams {
  clusterId: string | undefined
  nodeId: string | undefined
}

interface IchartDateRange {
  value: number
  unit: OpUnitType
}

const nodeContainerColumns: ColumnProps<IsnapshotNodeContainerObjectData>[] = [
  {
    title: 'Container Id',
    dataIndex: 'container_id',
    key: 'container_id',
    align: 'center'
  },
  {
    title: 'Metric Name',
    dataIndex: 'metric_name',
    key: 'metric_name',
    align: 'center'
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    align: 'center'
  },
  {
    title: 'Metric Label',
    dataIndex: 'metric_label',
    key: 'metric_label',
    align: 'center'
  },
  {
    title: 'Date',
    dataIndex: 'ts',
    key: 'ts',
    align: 'center'
  }
]

const nodeProcessColumns: ColumnProps<IsnapshotNodeProcessObjectData>[] = [
  {
    title: 'Process ID',
    dataIndex: 'process_id',
    key: 'process_id',
    align: 'center'
  },
  {
    title: 'Metric Name',
    dataIndex: 'metric_name',
    key: 'metric_name',
    align: 'center'
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    align: 'center'
  },
  {
    title: 'Metric Label',
    dataIndex: 'metric_label',
    key: 'metric_label',
    align: 'center'
  },
  {
    title: 'Date',
    dataIndex: 'ts',
    key: 'ts',
    align: 'center'
  }
]

const NodeDetail = () => {
  const match = useRouteMatch<Iparams>('/clusters/:clusterId/nodes/:nodeId')
  const [
    snapshotData,
    setSnapshotData
  ] = useState<IsnapshotNodeObjectData | null>(null)
  const [
    cpuChartConfig,
    setCpuChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    memoryChartConfig,
    setMemoryChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    nodeContainersData,
    setNodeContainersData
  ] = useState<IsnapshotNodeContainerObjectData | null>(null)
  const [
    nodeProcessesData,
    setNodeProcessesData
  ] = useState<IsnapshotNodeProcessObjectData | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartDateRange, setChartDateRange] = useState<IchartDateRange>({
    value: 1,
    unit: 'hour'
  })
  const [chartTickInterval, setChartTickInterval] = useState(5)

  const ChangeChartDateRange = (value: any) => {
    setChartDateRange({
      value: Number(value.split(' ')[0]),
      unit: value.split(' ')[1]
    })
    switch (value.split(' ')[1]) {
      case 'hour':
        setChartTickInterval(5)
        break
      case 'day':
        setChartTickInterval(1)
        break
      case 'month':
        setChartTickInterval(1)
        break
      default:
        setChartTickInterval(5)
    }
  }

  const fetchData = useCallback(async () => {
    try {
      if (match) {
        const { data: metricDataResponse } = await getMetricsNode(
          Number(match.params.clusterId),
          Number(match.params.nodeId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.value}`
        )
        const nodeCpuLoadAvg1 = metricDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_1'
        )
        const nodeCpuLoadAvg5 = metricDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_5'
        )
        const nodeCpuLoadAvg15 = metricDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_15'
        )
        const nodeMemoryTotal = metricDataResponse.filter(
          item => item.metric_name === 'node_memory_total'
        )
        const nodeMemoryUsed = metricDataResponse.filter(
          item => item.metric_name === 'node_memory_used'
        )
        if (nodeCpuLoadAvg1) {
          setCpuChartConfig({
            xAxis: {
              type: 'datetime',
              categories: nodeCpuLoadAvg1.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'node_cpu_load_avg_1',
                data: nodeCpuLoadAvg1.map(item => item.value)
              },
              {
                type: 'line',
                name: 'node_cpu_load_avg_5',
                data: nodeCpuLoadAvg5.map(item => item.value)
              },
              {
                type: 'line',
                name: 'node_cpu_load_avg_15',
                data: nodeCpuLoadAvg15.map(item => item.value)
              }
            ]
          })
          setMemoryChartConfig({
            xAxis: {
              type: 'datetime',
              categories: nodeMemoryTotal.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'node_memory_total',
                data: nodeMemoryTotal.map(item => item.value)
              },
              {
                type: 'line',
                name: 'node_memory_used',
                data: nodeMemoryUsed.map(item => item.value)
              }
            ]
          })
          const { data: snapShotResponse } = await getSnapshotNode(
            Number(match.params.clusterId),
            Number(match.params.nodeId)
          )
          const {
            data: snapShotContainersResponse
          } = await getSnapshotNodeContainers(
            Number(match.params.clusterId),
            Number(match.params.nodeId)
          )
          const {
            data: snapShotProcessesResponse
          } = await getSnapshotNodeProcesses(
            Number(match.params.clusterId),
            Number(match.params.nodeId)
          )
          setSnapshotData(snapShotResponse)
          setNodeContainersData(snapShotContainersResponse)
          setNodeProcessesData(snapShotProcessesResponse)
        }
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [chartDateRange])

  useEffect(() => {
    fetchData()
  }, [chartDateRange])

  useInterval(() => {
    !loading && !error ? fetchData() : console.log('')
  }, 10000)
  return (
    <>
      {loading && !snapshotData ? (
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
                  {match.params.clusterId}
                </Link>
              </Breadcrumb.Item>
            ) : null}
            {match ? (
              <Breadcrumb.Item>
                <Link to={`/clusters/${match.params.clusterId}/nodes`}>
                  Node List
                </Link>
              </Breadcrumb.Item>
            ) : null}
            <Breadcrumb.Item>
              {snapshotData ? Object.keys(snapshotData)[0] : null}
            </Breadcrumb.Item>
          </Breadcrumb>
          <ChartTitleContainer>
            <TitleContainer
              level={2}
              text={snapshotData ? Object.keys(snapshotData)[0] : null}
            />
            <SelectDate onChange={ChangeChartDateRange} />
          </ChartTitleContainer>
          <MarginRow gutter={16}>
            <Col span={24}>
              <Card title="CPU" bordered={false}>
                {cpuChartConfig && Object.keys(cpuChartConfig).length !== 0 ? (
                  <LineChart config={cpuChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={24}>
              <Card title="Memory" bordered={false}>
                {memoryChartConfig &&
                Object.keys(memoryChartConfig).length !== 0 ? (
                  <LineChart config={memoryChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={24}>
              <TitleContainer level={2} text={'Container List'} />
              {nodeContainersData &&
              Object.keys(nodeContainersData).length !== 0 ? (
                Object.entries(nodeContainersData).map(
                  ([title, value]: [string, any]) => {
                    return (
                      <TableContainer
                        rowKey={'container_id'}
                        title={title}
                        columns={nodeContainerColumns}
                        data={value}
                      />
                    )
                  }
                )
              ) : (
                <Empty />
              )}
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={24}>
              <TitleContainer level={2} text={'Process List'} />
              {nodeProcessesData &&
              Object.keys(nodeProcessesData).length !== 0 ? (
                Object.entries(nodeProcessesData).map(
                  ([title, value]: [string, any]) => {
                    return (
                      <TableContainer
                        rowKey={'process_id'}
                        title={title}
                        columns={nodeProcessColumns}
                        data={value}
                      />
                    )
                  }
                )
              ) : (
                <Empty />
              )}
            </Col>
          </MarginRow>
        </>
      )}
    </>
  )
}

export default NodeDetail
