import React from 'react'
import {
  Row,
  Col,
  Card,
  Table,
  Statistic,
  Breadcrumb,
  Skeleton,
  Empty,
  Tag
} from 'antd'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import { match } from 'react-router'
import * as Highcharts from 'highcharts'
import BreadcrumbDropdown, {
  IbreadcrumbDropdownMenu
} from '../../components/BreadcrumbDropdown'
import LineChart from '../../components/LineChart'
import TitleContainer from '../../components/TitleContainer'
import SelectDate from '../../components/SelectDate'
import { IsummaryClustersData } from '../../apis/summary'
import { IclusterNodesData } from '../../apis/clusters'

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
  .right-box {
    display: flex;
  }
  .ant-tag {
    padding-top: 5px;
    height: 32px;
  }
`

interface Iparams {
  clusterId: string | undefined
}

interface Ipros {
  loading: boolean
  dropdownList: IbreadcrumbDropdownMenu[] | null
  selectedClusterTitle: string
  usageData: IsummaryClustersData[] | null
  match: match<Iparams> | null
  nodeListData: IclusterNodesData[] | null
  nodeListColumns: ColumnProps<IclusterNodesData>[]
  ChangeChartDateRange: (value: any) => void
  cpuChartConfig: Highcharts.Options | null
  memoryChartConfig: Highcharts.Options | null
  podChartConfig: Highcharts.Options | null
  dbQueryTime: string | null
}

const ClusterDetailPresenter = ({
  loading,
  dropdownList,
  selectedClusterTitle,
  usageData,
  match,
  nodeListData,
  nodeListColumns,
  ChangeChartDateRange,
  cpuChartConfig,
  memoryChartConfig,
  podChartConfig,
  dbQueryTime
}: Ipros) => {
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
              <BreadcrumbDropdown
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
            <div className="right-box">
              {dbQueryTime && <Tag color="#f50">{dbQueryTime}</Tag>}
              <SelectDate onChange={ChangeChartDateRange} />
            </div>
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

export default ClusterDetailPresenter
