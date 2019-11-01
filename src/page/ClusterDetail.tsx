import React, { useState, useEffect, useCallback } from 'react'
import {
  Typography,
  Row,
  Col,
  Card,
  Table,
  List,
  Breadcrumb,
  Skeleton,
  Empty
} from 'antd'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'
import * as Highcharts from 'highcharts'
import { Link, useRouteMatch } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import LineChart from '../components/LineChart'
import useInterval from '../utils/useInterval'
import { IclusterNodesData, getClusterNodes } from '../apis/clusters'
import { IsummaryClustersData, getSummaryCluster } from '../apis/summary'
import { getMetricsNodes, getMetricsPods } from '../apis/metrics'

const { Title } = Typography

interface StateCircularProps {
  readonly active: boolean
}

const FixedBox = styled.div`
  height: 231px;
  .scrollBox {
    overflow: auto;
  }
`

const PaddingRow = styled(Row)`
  margin-top: 16px;
`

const ScrollListCard = styled(Card)`
  .ant-card-body {
    overflow-y: scroll;
    height: 300px;
  }
  .ant-list-item {
    font-size: 12px;
    justify-content: space-between;

    span {
      display: inline-block;
      vertical-align: middle;
      margin-right: 16px;
    }

    strong {
      display: inline-block;
      vertical-align: middle;
      max-width: 200px;
    }
  }
`

const StateCircular = styled.span<StateCircularProps>`
  vertical-align: middle;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 12px;
  border-radius: 50%;
  ${props =>
    props.active
      ? css`
          background-color: #2ecc71;
        `
      : css`
          background-color: #7f8c8d;
        `}
`

const RightDateText = styled.span`
  display: inline-block;
  width: 100px;
  text-align: center;
`

const NamespacesData: InamespacesData[] = [
  {
    name: 'default',
    phase: 'Active',
    creationTimestamp: '2019-10-16T05:08:37Z'
  },
  {
    name: 'kube-public',
    phase: 'Active',
    creationTimestamp: '2019-10-16T05:08:37Z'
  },
  {
    name: 'kube-system',
    phase: 'Active',
    creationTimestamp: '2019-10-16T05:08:37Z'
  },
  {
    name: 'kubernetes-dashboard',
    phase: 'Active',
    creationTimestamp: '2019-10-16T05:25:38Z'
  },
  {
    name: 'nexclipper',
    phase: 'Active',
    creationTimestamp: '2019-10-16T05:25:39Z'
  },
  {
    name: 'nexclipperagent',
    phase: 'Active',
    creationTimestamp: '2019-10-16T05:25:39Z'
  }
]

const DaemonSetsData: IdaemonSetsData[] = [
  {
    name: 'kube-flannel-ds',
    namespace: 'kube-system',
    numberUnavailable: 0,
    numberReady: 4,
    numberAvailable: 4,
    creationTimestamp: '2019-10-16T05:25:39Z'
  },
  {
    name: 'kube-proxy',
    namespace: 'kube-system',
    numberUnavailable: 0,
    numberReady: 4,
    numberAvailable: 4,
    creationTimestamp: '2019-10-16T05:10:36Z'
  },
  {
    name: 'nvidia-gpu-device-plugin',
    namespace: 'kube-system',
    numberUnavailable: 0,
    numberReady: 0,
    numberAvailable: 0,
    creationTimestamp: '2019-10-16T05:10:38Z'
  },
  {
    name: 'nvidia-gpu-device-plugin-1-8',
    namespace: 'kube-system',
    numberUnavailable: 0,
    numberReady: 0,
    numberAvailable: 0,
    creationTimestamp: '2019-10-16T05:25:39Z'
  },
  {
    name: 'nexclipper-agent',
    namespace: 'nexclipperagent',
    numberUnavailable: 0,
    numberReady: 4,
    numberAvailable: 4,
    creationTimestamp: '2019-10-21T08:01:10Z'
  }
]

const DeploymentsData: IdeploymentsData[] = [
  {
    name: 'terrifying-eel-nginx-ingress-controller',
    namespace: 'default',
    availableReplicas: 1,
    replicas: 1,
    creationTimestamp: '2019-10-16T06:42:17Z'
  },
  {
    name: 'terrifying-eel-nginx-ingress-controller-default-backend',
    namespace: 'default',
    availableReplicas: 1,
    replicas: 1,
    creationTimestamp: '2019-10-16T06:42:17Z'
  },
  {
    name: 'cert-manager-cert-manager',
    namespace: 'kube-system',
    availableReplicas: 1,
    replicas: 1,
    creationTimestamp: '2019-10-16T06:24:27Z'
  },
  {
    name: 'kube-dns',
    namespace: 'kube-system',
    availableReplicas: 4,
    replicas: 4,
    creationTimestamp: '2019-10-16T05:10:40Z'
  }
]

interface Iparams {
  clusterId: string | undefined
}

const ClusterDetail = () => {
  const match = useRouteMatch<Iparams>('/clusters/:clusterId')
  const [nodeListData, setNodeListData] = useState<IclusterNodesData[] | null>(
    null
  )
  const [usageData, setUsageData] = useState<IsummaryClustersData[] | null>(
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
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)

  const nodeListColumns: ColumnProps<IclusterNodesData>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (value, _, index) =>
        nodeListData && match ? (
          <Link
            to={`/clusters/${match.params.clusterId}/nodes/${nodeListData[index].id}`}
          >
            {value}
          </Link>
        ) : null,
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

  const clusterSummaryColumns: ColumnProps<IsummaryClustersData>[] = [
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
            data: { data: nodeListResponse }
          }
        } = await getClusterNodes(Number(match.params.clusterId))
        const { data: clusterSummaryResponse } = await getSummaryCluster(
          Number(match.params.clusterId)
        )
        let summaryData: any[] = []
        summaryData = Object.values(clusterSummaryResponse).map((item, index) =>
          item
            ? {
                ...item,
                ...Object.values(clusterSummaryResponse).slice(0)[index]
              }
            : null
        )
        const { data: metricNodeDataResponse } = await getMetricsNodes(
          Number(match.params.clusterId),
          `dateRange=${dayjs(Date.now())
            .utc()
            .subtract(30, 'minute')
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(Date.now())
            .utc()
            .format(
              'YYYY-MM-DD HH:mm:ss'
            )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15`
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
            .utc()
            .subtract(30, 'minute')
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(Date.now())
            .utc()
            .format(
              'YYYY-MM-DD HH:mm:ss'
            )}&metricNames=container_memory_rss&metricNames=container_cpu_usage_total`
        )
        const containerMemoryRss = metricPodsDataResponse.filter(
          item => item.metric_name === 'container_memory_rss'
        )
        const containerCpuUsageTotal = metricPodsDataResponse.filter(
          item => item.metric_name === 'container_cpu_usage_total'
        )
        if (nodeCpuLoadAvg1) {
          setCpuChartConfig({
            xAxis: {
              type: 'datetime',
              categories: nodeCpuLoadAvg1.map(item =>
                dayjs(item.bucket).format('H:mm:ss')
              ),
              tickInterval: 30
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
                dayjs(item.bucket).format('H:mm:ss')
              ),
              tickInterval: 30
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
          setPodChartConfig({
            xAxis: {
              type: 'datetime',
              categories: containerMemoryRss.map(item =>
                dayjs(item.bucket).format('H:mm:ss')
              ),
              tickInterval: 30
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
          })
        }
        setNodeListData(nodeListResponse)
        setUsageData(summaryData)
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
  }, 10000)

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
            <Breadcrumb.Item>
              {match ? match.params.clusterId : null}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>Clutser Detail</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="Node list"
                bordered={false}
                extra={
                  match ? (
                    <Link to={`/clusters/${match.params.clusterId}/nodes`}>
                      More
                    </Link>
                  ) : null
                }
              >
                <FixedBox>
                  {nodeListData ? (
                    <Table
                      rowKey="id"
                      columns={nodeListColumns}
                      dataSource={nodeListData}
                      scroll={{ y: 100 }}
                    />
                  ) : (
                    <Empty />
                  )}
                </FixedBox>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Cluster Usage" bordered={false}>
                <FixedBox>
                  {usageData ? (
                    <Table
                      rowKey="node_memory_total"
                      columns={clusterSummaryColumns}
                      dataSource={usageData}
                      pagination={false}
                    />
                  ) : (
                    <Empty />
                  )}
                </FixedBox>
              </Card>
            </Col>
          </Row>
          <PaddingRow gutter={16}>
            <Col span={8}>
              <Card title="CPU" bordered={false}>
                {cpuChartConfig ? (
                  <LineChart config={cpuChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Memory" bordered={false}>
                {memoryChartConfig ? (
                  <LineChart config={memoryChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Pod" bordered={false}>
                {podChartConfig ? (
                  <LineChart config={podChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </PaddingRow>
          {/* <PaddingRow gutter={16}>
            <Col span={8}>
              <ScrollListCard title="Namespaces [6/6]" bordered={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={NamespacesData}
                  renderItem={item => (
                    <List.Item>
                      <div>
                        <StateCircular
                          active={item.phase === 'Active' ? true : false}
                        />
                        <strong>{item.name}</strong>
                      </div>
                      <RightDateText>{item.creationTimestamp}</RightDateText>
                    </List.Item>
                  )}
                />
              </ScrollListCard>
            </Col>
            <Col span={8}>
              <ScrollListCard title="Daemon Sets [5/5]" bordered={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={DaemonSetsData}
                  renderItem={item => (
                    <List.Item>
                      <div>
                        <StateCircular
                          active={item.numberUnavailable === 0 ? true : false}
                        />
                        <strong>{item.name}</strong>
                      </div>
                      <div>
                        <span>{item.namespace}</span>
                        <span>
                          [{item.numberReady}/{item.numberAvailable}]
                        </span>
                        <RightDateText>{item.creationTimestamp}</RightDateText>
                      </div>
                    </List.Item>
                  )}
                />
              </ScrollListCard>
            </Col>
            <Col span={8}>
              <ScrollListCard title="Deployments [15/15]" bordered={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={DeploymentsData}
                  renderItem={item => (
                    <List.Item>
                      <div>
                        <StateCircular
                          active={
                            item.replicas === item.availableReplicas
                              ? true
                              : false
                          }
                        />
                        <strong>{item.name}</strong>
                      </div>
                      <div>
                        <span>{item.namespace}</span>
                        <span>
                          [{item.availableReplicas}/{item.replicas}]
                        </span>
                        <RightDateText>{item.creationTimestamp}</RightDateText>
                      </div>
                    </List.Item>
                  )}
                />
              </ScrollListCard>
            </Col>
          </PaddingRow> */}
        </>
      )}
    </>
  )
}

export default ClusterDetail
