import React, { useState, useEffect, useCallback } from 'react'
import {
  Row,
  Col,
  Card,
  Table,
  Statistic,
  Breadcrumb,
  Skeleton,
  Empty
} from 'antd'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import * as Highcharts from 'highcharts'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import mapValues from 'lodash-es/mapValues'
import { RootState } from '../reducers'
import { ColumnProps } from 'antd/es/table'
import { OpUnitType } from 'dayjs'
import { IsummaryClustersData, getSummaryCluster } from '../apis/summary'
import LineChart from '../components/LineChart'
import TitleContainer from '../components/TitleContainer'
import SelectDate from '../components/SelectDate'
import useInterval from '../utils/useInterval'
import {
  IclusterNodesData,
  getClusterNodes,
  getClusters
} from '../apis/clusters'
import { getMetricsNodes, getMetricsPods } from '../apis/metrics'
import { setCluster } from '../reducers/cluster'
import BeadcrumbDropdown, {
  IbreadcrumbDropdownMenu
} from '../components/BreadcrumbDropdown'
import { logger } from '../utils/logger'

dayjs.extend(utc)

interface IchartDateRange {
  value: number
  unit: OpUnitType
}

const PaddingRow = styled(Row)`
  margin-bottom: 16px;
`

const ChartContainer = styled(Card)`
  .ant-card-body {
    height: 500px;
  }
`

const ChartTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  .ant-typography {
    margin: 0;
  }
`
interface Iparams {
  clusterId: string | undefined
}

const ClusterDetail = () => {
  const selectedClusterTitle = useSelector(
    (state: RootState) => state.cluster.name
  )
  const dispatch = useDispatch()
  const match = useRouteMatch<Iparams>('/clusters/:clusterId')
  const location = useLocation()
  const [nodeListData, setNodeListData] = useState<IclusterNodesData[] | null>(
    null
  )
  const [
    cpuChartConfig,
    setCpuChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    memoryChartConfig,
    setMemoryChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    podChartConfig,
    setPodChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [usageData, setUsageData] = useState<IsummaryClustersData[] | null>(
    null
  )
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartDateRange, setChartDateRange] = useState<IchartDateRange>({
    value: 1,
    unit: 'hour'
  })
  const [chartTickInterval, setChartTickInterval] = useState(90)
  const [dropdownList, setDropdownList] = useState<
    IbreadcrumbDropdownMenu[] | null
  >(null)
  const nodeListColumns: ColumnProps<IclusterNodesData>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (value, _, index) =>
        nodeListData &&
        match && <Link to={`/nodes/${nodeListData[index].id}`}>{value}</Link>,
      width: 130,
      align: 'center'
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
      align: 'center'
    },
    {
      title: 'OS',
      dataIndex: 'os',
      key: 'os',
      width: 100,
      align: 'center'
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
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
      key: 'platform_version',
      align: 'center'
    }
  ]

  const ChangeChartDateRange = (value: any) => {
    setChartDateRange({
      value: Number(value.split(' ')[0]),
      unit: value.split(' ')[1]
    })
    switch (value.split(' ')[1]) {
      case 'hour':
        setChartTickInterval(90)
        break
      case 'day':
        setChartTickInterval(20)
        break
      case 'month':
        setChartTickInterval(1)
        break
      default:
        setChartTickInterval(90)
    }
  }
  const fetchData = useCallback(async () => {
    try {
      if (match) {
        const { data: ClustersResponse } = await getClusters()
        let DropDwonList: IbreadcrumbDropdownMenu[] = []
        ClustersResponse.map(item =>
          DropDwonList.push({
            id: item.id,
            link: `/clusters/${item.id}`,
            text: item.name
          })
        )
        match &&
          match.params.clusterId &&
          dispatch(
            setCluster(Number(match.params.clusterId), ClustersResponse[0].name)
          )
        setDropdownList(DropDwonList)
        const { data: metricNodeDataResponse } = await getMetricsNodes(
          Number(match.params.clusterId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.unit}`
        )
        const nodeCpuLoadAvg1 = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_1'
        )
        const nodeCpuLoadAvg5 = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_5'
        )
        const nodeCpuLoadAvg15 = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_15'
        )
        const nodeMemoryTotal = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_memory_total'
        )
        const nodeMemoryUsed = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_memory_used'
        )
        const { data: metricPodsDataResponse } = await getMetricsPods(
          Number(match.params.clusterId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&metricNames=container_memory_rss&metricNames=container_cpu_usage_total&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.unit}`
        )
        const containerMemoryRss = metricPodsDataResponse.filter(
          item => item.metric_name === 'container_memory_rss'
        )
        const containerCpuUsageTotal = metricPodsDataResponse.filter(
          item => item.metric_name === 'container_cpu_usage_total'
        )
        if (nodeCpuLoadAvg1) {
          const CpuChartConfig: Highcharts.Options = {
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
          }
          setCpuChartConfig(
            metricNodeDataResponse.length !== 0 ? CpuChartConfig : null
          )
          const MemoryChartConfig: Highcharts.Options = {
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
          }
          setMemoryChartConfig(
            metricNodeDataResponse.length !== 0 ? MemoryChartConfig : null
          )
          const PodChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: containerMemoryRss.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval * 5
            },
            series: [
              {
                type: 'line',
                name: 'container_memory_rss',
                data: containerMemoryRss.map(item => item.value)
              },
              {
                type: 'line',
                name: 'container_cpu_usage_total',
                data: containerCpuUsageTotal.map(item => item.value)
              }
            ]
          }
          setPodChartConfig(
            metricPodsDataResponse.length !== 0 ? PodChartConfig : null
          )
          const {
            data: {
              data: { data: nodeListResponse }
            }
          } = await getClusterNodes(Number(match.params.clusterId))
          setNodeListData(nodeListResponse)
          const { data: clusterSummaryResponse } = await getSummaryCluster(
            Number(match.params.clusterId)
          )
          let summaryData: any[] = []
          summaryData = Object.values(clusterSummaryResponse).map(
            (item, index) =>
              item && {
                ...item,
                ...Object.values(clusterSummaryResponse).slice(0)[index]
              }
          )
          setUsageData(summaryData.length !== 0 ? summaryData : null)
        }
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [chartDateRange, location])

  useEffect(() => {
    fetchData()
  }, [chartDateRange, location])

  useInterval(() => (!loading && !error ? fetchData() : null), 10000)

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
            {dropdownList && (
              <BeadcrumbDropdown
                overlayMenu={dropdownList}
                dropdownText={selectedClusterTitle}
              />
            )}
          </Breadcrumb>
          <TitleContainer level={2} text={selectedClusterTitle} />
          <PaddingRow gutter={16}>
            <Col span={6}>
              <Card loading={loading}>
                {usageData ? (
                  <Statistic
                    title="node cpu load avg 1"
                    value={usageData[0].node_cpu_load_avg_1}
                    precision={2}
                    suffix="%"
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading}>
                {usageData ? (
                  <Statistic
                    title="node cpu load avg 15"
                    value={usageData[0].node_cpu_load_avg_15}
                    precision={2}
                    suffix="%"
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading}>
                {usageData ? (
                  <Statistic
                    title="node memory used"
                    value={usageData[0].node_memory_used / 1024 / 1024 / 1024}
                    precision={2}
                    suffix="GB"
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading}>
                {usageData ? (
                  <Statistic
                    title="node memory total"
                    value={usageData[0].node_memory_total / 1024 / 1024 / 1024}
                    precision={2}
                    suffix="GB"
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </PaddingRow>
          <PaddingRow gutter={16}>
            <Col span={24}>
              <Card
                title="Node list"
                bordered={false}
                extra={match && <Link to={'/nodes'}>More</Link>}
                loading={loading}
              >
                {nodeListData ? (
                  <Table
                    rowKey="id"
                    columns={nodeListColumns}
                    dataSource={nodeListData}
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </PaddingRow>
          <ChartTitleContainer>
            <TitleContainer level={4} text={'Charts'} />
            <SelectDate onChange={ChangeChartDateRange} />
          </ChartTitleContainer>
          <Row gutter={16}>
            <Col span={podChartConfig ? 8 : 12}>
              <ChartContainer title="CPU" bordered={false} loading={loading}>
                {cpuChartConfig ? (
                  <LineChart config={cpuChartConfig} />
                ) : (
                  <Empty />
                )}
              </ChartContainer>
            </Col>
            <Col span={podChartConfig ? 8 : 12}>
              <ChartContainer title="Memory" bordered={false} loading={loading}>
                {memoryChartConfig ? (
                  <LineChart config={memoryChartConfig} />
                ) : (
                  <Empty />
                )}
              </ChartContainer>
            </Col>
            {podChartConfig && (
              <Col span={8}>
                <ChartContainer title="Pod" bordered={false} loading={loading}>
                  <LineChart config={podChartConfig} />
                </ChartContainer>
              </Col>
            )}
          </Row>
        </>
      )}
    </>
  )
}

export default ClusterDetail
