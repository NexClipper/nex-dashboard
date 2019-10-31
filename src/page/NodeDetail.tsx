import React, { useState, useEffect } from 'react'
import {
  Breadcrumb,
  Typography,
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
import LineChart from '../components/LineChart'
import InfoContainer from '../components/InfoContainer'
import TableContainer from '../components/TableContainer'
import { IsnapshotNodeObjectData, getSnapshotNode } from '../apis/snapshot'
import { getMetricsNode } from '../apis/metrics'
import useInterval from '../utils/useInterval'

dayjs.extend(utc)

const { Title } = Typography
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
  overflow-y: auto;
`

const MarginRow = styled(Row)`
  margin-top: 16px;
`

interface IpodListData {
  metadata: object
  status: object
  resource: object
}

const columns: ColumnProps<ItableColumns>[] = [
  {
    title: 'Name',
    dataIndex: 'metadata.name',
    key: 'metadata.name'
  },
  {
    title: 'Status',
    dataIndex: 'status.phase',
    key: 'status.phase',
    render: status => (
      <span>
        {status === 'Running' ? (
          <Tag color="#2ecc71">{status}</Tag>
        ) : (
          <Tag color="#e67e22">{status}</Tag>
        )}
      </span>
    )
  },
  {
    title: 'Host Ip',
    dataIndex: 'status.hostIP',
    key: 'status.hostIP'
  },
  {
    title: 'Namespace',
    dataIndex: 'metadata.namespace',
    key: 'metadata.namespace'
  },
  {
    title: 'Kind',
    dataIndex: 'metadata.ownerReferences.kind',
    key: 'metadata.ownerReferences.kind'
  },
  {
    title: 'CPU(%)',
    dataIndex: 'resource.used_percent.cpu',
    key: 'resource.used_percent.cpu',
    render: cpu => <Progress size="small" percent={Math.floor(Number(cpu))} />
  },
  {
    title: 'Memory(%)',
    dataIndex: 'resource.used_percent.memory',
    key: 'resource.used_percent.memory',
    render: memory => (
      <Progress size="small" percent={Math.floor(Number(memory))} />
    )
  }
]

const NodePodListData: IpodListData[] = [
  {
    metadata: {
      name: 'kube-flannel-ds-dz66p',
      namespace: 'kube-system',
      ownerReferences: {
        kind: 'DaemonSet'
      }
    },
    status: {
      phase: 'Running',
      hostIP: '10.0.0.20'
    },
    resource: {
      used_percent: {
        cpu: '0.3',
        memory: '3.766'
      }
    }
  },
  {
    metadata: {
      name: 'nexclipper-collector-bb5df448b-xn696',
      namespace: 'nexclipper',
      ownerReferences: {
        kind: 'ReplicaSet'
      }
    },
    status: {
      phase: 'Running',
      hostIP: '10.0.0.17'
    },
    resource: {
      used_percent: {
        cpu: '17',
        memory: '26.843'
      }
    }
  },
  {
    metadata: {
      name: 'nexclipper-service-5859dc7f4b-gnzxr',
      namespace: 'nexclipper',
      ownerReferences: {
        kind: 'ReplicaSet'
      }
    },
    status: {
      phase: 'Running',
      hostIP: '10.0.0.17'
    },
    resource: {
      used_percent: {
        cpu: '0.1',
        memory: '73.201'
      }
    }
  },
  {
    metadata: {
      name: 'nexclipper-workflow-68d64c8995-9q75r',
      namespace: 'nexclipper',
      ownerReferences: {
        kind: 'ReplicaSet'
      }
    },
    status: {
      phase: 'Running',
      hostIP: '10.0.0.17'
    },
    resource: {
      used_percent: {
        cpu: '0.1',
        memory: '15.798'
      }
    }
  }
]

interface Iparams {
  clusterId: string | undefined
  nodeId: string | undefined
}

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
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    try {
      if (match) {
        const { data: snapShotResponse } = await getSnapshotNode(
          Number(match.params.clusterId),
          Number(match.params.nodeId)
        )
        setSnapshotData(snapShotResponse)
        const { data: metricDataResponse } = await getMetricsNode(
          Number(match.params.clusterId),
          Number(match.params.nodeId),
          `dateRange=${dayjs(Date.now())
            .utc()
            .subtract(1, 'day')
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(Date.now())
            .utc()
            .format(
              'YYYY-MM-DD HH:mm:ss'
            )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15`
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
                dayjs(item.bucket).format('YY-MM-DD H:mm:ss')
              ),
              tickInterval: 90
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
                dayjs(item.bucket).format('YY-MM-DD H:mm:ss')
              ),
              tickInterval: 90
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
        }
      }
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useInterval(() => {
    !loading && !error ? fetchData() : console.log('')
  }, 1000)
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
                  Clutser Name
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
          <Title level={2}>
            {snapshotData ? Object.keys(snapshotData)[0] : null}
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Node Information" bordered={false}>
                <FixedBox>
                  <InfoContainer>
                    <li>
                      <p className="title">Node Name</p>
                      <p>
                        oke-c3tmzbqgmzd-n3wiolfmuzt-s5cclcvxucq-1.sub06030309400.oke.oraclevcn.com
                      </p>
                    </li>
                    <li>
                      <p className="title">Node Ip</p>
                      <p>10.0.0.17</p>
                    </li>
                    <li>
                      <p className="title">Creation Time</p>
                      <p>2019-10-16T05:15:11Z</p>
                    </li>
                    <li>
                      <p className="title">UID</p>
                      <p>ed5b4322-efd3-11e9-925d-0a580aed0cb1</p>
                    </li>
                    <li>
                      <p className="title">SelfLink</p>
                      <p>/api/v1/nodes/10.0.0.17</p>
                    </li>
                    <li>
                      <p className="title">Resource Version</p>
                      <p>1914269</p>
                    </li>
                    <li>
                      <p className="title">Labels</p>
                      <div>
                        <CropTag color="geekblue">
                          beta.kubernetes.io/arch:amd64
                        </CropTag>
                        <CropTag color="geekblue">
                          beta.kubernetes.io/instance-type:VM.Standard2.2
                        </CropTag>
                        <CropTag color="geekblue">
                          beta.kubernetes.io/os:linux
                        </CropTag>
                        <CropTag color="geekblue">
                          displayName:oke-c3tmzbqgmzd-n3wiolfmuzt-s5cclcvxucq-1
                        </CropTag>
                        <CropTag color="geekblue">
                          failure-domain.beta.kubernetes.io/region:ap-seoul-1
                        </CropTag>
                        <CropTag color="geekblue">
                          node.info/compartment.id_suffix:aaaaaaaaewlxiiihcocvrk5fss65b7cjdesfcctm44hc3jr2pkanckmo5wba
                        </CropTag>
                      </div>
                    </li>
                    <li>
                      <p className="title">Annotations</p>
                      <div>
                        <CropTag color="geekblue">
                          alpha.kubernetes.io/provided-node-ip:10.0.0.17
                        </CropTag>
                        <CropTag color="geekblue">
                          flannel.alpha.coreos.com/backend-type:vxlan
                        </CropTag>
                        <CropTag color="geekblue">
                          volumes.kubernetes.io/controller-managed-attach-detach:true
                        </CropTag>
                      </div>
                    </li>
                  </InfoContainer>
                </FixedBox>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="System Information" bordered={false}>
                <FixedBox>
                  <InfoContainer>
                    <li>
                      <p className="title">Architecture</p>
                      <p>amd64</p>
                    </li>
                    <li>
                      <p className="title">Boot ID</p>
                      <p>7aa17218-1f95-4635-80fc-ed82e739f02c</p>
                    </li>
                    <li>
                      <p className="title">Container Runtime Version</p>
                      <p>docker://18.9.1</p>
                    </li>
                    <li>
                      <p className="title">KernelVersion</p>
                      <p>4.14.35-1902.2.0.el7uek.x86_64</p>
                    </li>
                    <li>
                      <p className="title">Kube Proxy Version</p>
                      <p>v1.13.5</p>
                    </li>
                    <li>
                      <p className="title">Kubelet Version</p>
                      <p>v1.13.5</p>
                    </li>
                    <li>
                      <p className="title">Operating System</p>
                      <p>linux</p>
                    </li>
                    <li>
                      <p className="title">OS Image</p>
                      <p>Oracle Linux Server 7.6</p>
                    </li>
                    <li>
                      <p className="title">Machine ID</p>
                      <p>f55882225d9147c598d6cfcca167e226</p>
                    </li>
                    <li>
                      <p className="title">System UUID</p>
                      <p>1A11DDF3-B14B-45E8-91DF-E880EC386158</p>
                    </li>
                  </InfoContainer>
                </FixedBox>
              </Card>
            </Col>
          </Row>
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
              {/* <Search
            placeholder="Seach for ..."
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          /> */}
              <TableContainer
                key="PodList"
                title={'Pod List'}
                columns={columns}
                data={NodePodListData}
              />
            </Col>
          </MarginRow>
        </>
      )}
    </>
  )
}

export default NodeDetail
