import React from 'react'
import { Typography, Row, Col, Card, Table, List } from 'antd'
import styled, { css } from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import dayjs from 'dayjs'
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

const ClusterInfoContainer = styled.ul`
  display: flex;
  margin: 0;
  flex-wrap: wrap;
  height: 216px;
  li {
    width: 50%;
    margin-top: 16px;
    &:nth-child(1),
    :nth-child(2) {
      margin: 0;
    }
  }
  p {
    margin: 0;
  }
`

const BlodText = styled.p`
  font-weight: 700;
  font-size: 1.25rem;
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

const columns = [
  {
    title: 'resource',
    dataIndex: 'resource',
    key: 'resource'
  },
  {
    title: 'total',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: 'usage',
    dataIndex: 'usage',
    key: 'usage'
  },
  {
    title: 'usagePercent',
    dataIndex: 'usagePercent',
    key: 'usagePercent'
  }
]

const clusterUsageData = [
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

const cpuConfig = {
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    categories: cpuTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  legend: {
    align: 'center'
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

const memoryConfig = {
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    categories: memoryTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  legend: {
    align: 'center'
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

const podConfig = {
  title: {
    text: ''
  },
  xAxis: {
    type: 'datetime',
    categories: podTotalData.map(item => dayjs(item.time).format('H:m:s'))
  },
  legend: {
    align: 'center'
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

const NamespacesData = [
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

const DaemonSetsData = [
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

const DeploymentsData = [
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

function Cluster() {
  return (
    <>
      <Title level={2}>Cluster</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Cluster" bordered={false}>
            <ClusterInfoContainer>
              <li>
                <BlodText>gitVersion</BlodText>
                <p>v1.13.5-5+270f968ee96a91</p>
              </li>
              <li>
                <BlodText>goVersion</BlodText>
                <p>go1.11.5</p>
              </li>
              <li>
                <BlodText>gitCommit</BlodText>
                <p>270f968ee96a9166c3dee050b3f45d213e49a1d5</p>
              </li>
              <li>
                <BlodText>Platform</BlodText>
                <p>linux/amd64</p>
              </li>
              <li>
                <BlodText>Built</BlodText>
                <p>2019-07-25</p>
              </li>
            </ClusterInfoContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Cluster Usage" bordered={false}>
            <Table
              columns={columns}
              dataSource={clusterUsageData}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <PaddingRow gutter={16}>
        <Col span={8}>
          <Card title="CPU (Core)" bordered={false}>
            <ReactHighcharts config={cpuConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Memory (GB)" bordered={false}>
            <ReactHighcharts config={memoryConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Pod (Count)" bordered={false}>
            <ReactHighcharts config={podConfig} />
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

export default Cluster
