import React, { useState, useEffect } from 'react'
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
import { cpuTotalData } from '../apis/fakeData/cpuTotalData'
import { cpuUsedData } from '../apis/fakeData/cpuUsedData'
import { memoryTotalData } from '../apis/fakeData/memoryTotalData'
import { memoryUsedData } from '../apis/fakeData/memoryUsedData'
import { podTotalData } from '../apis/fakeData/podTotalData'
import { podUsedData } from '../apis/fakeData/podUsedData'
import { IclusterNodesData, getClusterNodes } from '../apis/clusters'
import { IsummaryClustersData, getSummaryCluster } from '../apis/summary'

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

const cpuConfig: Highcharts.Options = {
  series: [
    {
      type: 'line',
      name: 'CPU Total',
      data: cpuTotalData.map(item => item.cpuTotal),
      pointStart: dayjs(cpuTotalData[0].time).millisecond()
    },
    {
      type: 'line',
      name: 'CPU Used',
      data: cpuUsedData.map(item => item.cpuUsed),
      pointStart: dayjs(cpuUsedData[0].time).millisecond()
    }
  ],
  xAxis: {
    type: 'datetime'
  }
}

const memoryConfig: Highcharts.Options = {
  plotOptions: {
    column: {
      pointPlacement: 'between'
    }
  },
  xAxis: {
    type: 'datetime'
  },
  series: [
    {
      type: 'line',
      name: 'Memory Total',
      data: memoryTotalData.map(item => item.memoryTotal),
      pointStart: dayjs(memoryTotalData[0].time).millisecond()
    },
    {
      type: 'line',
      name: 'Memory Used',
      data: memoryUsedData.map(item => item.memoryUsed),
      pointStart: dayjs(memoryUsedData[0].time).millisecond()
    }
  ]
}

const podConfig: Highcharts.Options = {
  xAxis: {
    type: 'datetime',
    categories: podTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  series: [
    {
      type: 'line',
      name: 'Pod Total',
      data: podTotalData.map(item => item.podTotal)
    },
    {
      type: 'line',
      name: 'Pod Used',
      data: podUsedData.map(item => item.podUsed)
    }
  ]
}

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
      key: 'node_cpu_load_avg_1'
    },
    {
      title: 'node_cpu_load_avg_5',
      dataIndex: 'node_cpu_load_avg_5',
      key: 'node_cpu_load_avg_5'
    },
    {
      title: 'node_cpu_load_avg_15',
      dataIndex: 'node_cpu_load_avg_15',
      key: 'node_cpu_load_avg_15'
    },
    {
      title: 'node_cpu_load_avg_15',
      dataIndex: 'node_cpu_load_avg_15',
      key: 'node_cpu_load_avg_15'
    }
  ]

  const fetchClusters = async () => {
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
        // console.log(Object.values(clusterSummaryResponse)[0])
        setNodeListData(nodeListResponse)
        setUsageData(Object.values(clusterSummaryResponse)[0])
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClusters()
  }, [])

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
            <Breadcrumb.Item>Clutser Name</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={2}>Clutser Name</Title>
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
                      key="NodelistTable"
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
                      key="ClusterUsage"
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
              <Card title="CPU (Core)" bordered={false}>
                <LineChart config={cpuConfig} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Memory (GB)" bordered={false}>
                <LineChart config={memoryConfig} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Pod (Count)" bordered={false}>
                <LineChart config={podConfig} />
              </Card>
            </Col>
          </PaddingRow>
          <PaddingRow gutter={16}>
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
          </PaddingRow>
        </>
      )}
    </>
  )
}

export default ClusterDetail
