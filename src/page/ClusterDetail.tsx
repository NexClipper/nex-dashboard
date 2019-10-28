import React from 'react'
import { Typography, Row, Col, Card, Table, List, Breadcrumb } from 'antd'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'
import * as Highcharts from 'highcharts'
import { Link, useRouteMatch } from 'react-router-dom'
import InfoContaier from '../components/InfoContainer'
import Highchart from '../components/Highchart'
import { cpuTotalData } from '../apis/fakeData/cpuTotalData'
import { cpuUsedData } from '../apis/fakeData/cpuUsedData'
import { memoryTotalData } from '../apis/fakeData/memoryTotalData'
import { memoryUsedData } from '../apis/fakeData/memoryUsedData'
import { podTotalData } from '../apis/fakeData/podTotalData'
import { podUsedData } from '../apis/fakeData/podUsedData'

const { Title } = Typography

interface StateCircularProps {
  readonly active: boolean
}

const FixedBox = styled.div`
  height: 231px;
  overflow-y: auto;
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

const columns: ItableColumns[] = [
  {
    title: 'Resource',
    dataIndex: 'resource',
    key: 'resource'
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: 'Usage',
    dataIndex: 'usage',
    key: 'usage'
  },
  {
    title: 'UsagePercent',
    dataIndex: 'usagePercent',
    key: 'usagePercent'
  }
]

const clusterUsageData: IclusterUsageData[] = [
  {
    resource: 'CPU',
    total: 16,
    usage: 0.269,
    usagePercent: 1.681
  },
  {
    resource: 'Memory',
    total: 116.32,
    usage: 1.811,
    usagePercent: 1.557
  },
  {
    resource: 'Pod',
    total: 440,
    usage: 38,
    usagePercent: 8.636
  }
]

const cpuConfig: Highcharts.Options = {
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    categories: cpuTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  plotOptions: {
    line: {
      animation: false
    }
  },
  series: [
    {
      name: 'CPU Total',
      data: cpuTotalData.map(item => item.cpuTotal)
    },
    {
      name: 'CPU Used',
      data: cpuUsedData.map(item => item.cpuUsed)
    }
  ]
}

const memoryConfig: Highcharts.Options = {
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    categories: memoryTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  plotOptions: {
    line: {
      animation: false
    }
  },
  series: [
    {
      name: 'Memory Total',
      data: memoryTotalData.map(item => item.memoryTotal)
    },
    {
      name: 'Memory Used',
      data: memoryUsedData.map(item => item.memoryUsed)
    }
  ]
}

const podConfig: Highcharts.Options = {
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    categories: podTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  plotOptions: {
    line: {
      animation: false
    }
  },
  series: [
    {
      name: 'Pod Total',
      data: podTotalData.map(item => item.podTotal)
    },
    {
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
  if (match) console.log(match.params.clusterId)
  return (
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
      <Title level={2}>Cluster</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Cluster" bordered={false}>
            <FixedBox>
              <InfoContaier>
                <li>
                  <p className="title">gitVersion</p>
                  <p>v1.13.5-5+270f968ee96a91</p>
                </li>
                <li>
                  <p className="title">goVersion</p>
                  <p>go1.11.5</p>
                </li>
                <li>
                  <p className="title">gitCommit</p>
                  <p>270f968ee96a9166c3dee050b3f45d213e49a1d5</p>
                </li>
                <li>
                  <p className="title">Platform</p>
                  <p>linux/amd64</p>
                </li>
                <li>
                  <p className="title">Built</p>
                  <p>2019-07-25</p>
                </li>
              </InfoContaier>
            </FixedBox>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Cluster Usage" bordered={false}>
            <FixedBox>
              <Table
                key="ClusterUsage"
                columns={columns}
                dataSource={clusterUsageData}
                pagination={false}
              />
            </FixedBox>
          </Card>
        </Col>
      </Row>
      <PaddingRow gutter={16}>
        <Col span={8}>
          <Card title="CPU (Core)" bordered={false}>
            <Highchart config={cpuConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Memory (GB)" bordered={false}>
            <Highchart config={memoryConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Pod (Count)" bordered={false}>
            <Highchart config={podConfig} />
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
                        item.replicas === item.availableReplicas ? true : false
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
  )
}

export default ClusterDetail
