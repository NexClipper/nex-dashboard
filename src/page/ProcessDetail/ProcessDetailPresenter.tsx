import React from 'react'
import { Breadcrumb, Row, Col, Card, Skeleton, Empty, Statistic } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import keys from 'lodash-es/keys'
import * as Highcharts from 'highcharts'
import LineChart from '../../components/LineChart'
import TitleContainer from '../../components/TitleContainer'
import SelectDate from '../../components/SelectDate'
import { IsnapshotNodeProcessData } from '../../apis/snapshot'

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

interface Iprops {
  loading: boolean
  match: any
  snapshotData: IsnapshotNodeProcessData[] | null
  ChangeChartDateRange: (value: any) => void
  cpuChartConfig: Highcharts.Options | null
  memoryChartConfig: Highcharts.Options | null
  networkChartConfig: Highcharts.Options | null
}

const ProcessDetailPresenter = ({
  loading,
  match,
  snapshotData,
  ChangeChartDateRange,
  cpuChartConfig,
  memoryChartConfig,
  networkChartConfig
}: Iprops) => {
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
              <Link to="/nodes">Node List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {match && (
                <Link to={`/nodes/${match.params.nodeId}`}>
                  {match.params.nodeId}
                </Link>
              )}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {snapshotData && snapshotData[0].process}
            </Breadcrumb.Item>
          </Breadcrumb>
          <ChartTitleContainer>
            <TitleContainer
              level={2}
              text={snapshotData && snapshotData[0].process}
            />
            <SelectDate onChange={ChangeChartDateRange} />
          </ChartTitleContainer>
          <MarginRow gutter={16}>
            <Col span={24}>
              <Card title="CPU" bordered={false}>
                {cpuChartConfig && keys(cpuChartConfig).length !== 0 ? (
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
                {memoryChartConfig && keys(memoryChartConfig).length !== 0 ? (
                  <LineChart config={memoryChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={24}>
              <Card title="Network" bordered={false}>
                {networkChartConfig && keys(networkChartConfig).length !== 0 ? (
                  <LineChart config={networkChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={6}>
              <Card loading={loading}>
                {snapshotData ? (
                  <Statistic
                    title="process cpu percent"
                    value={
                      snapshotData.filter(
                        item => item.metric_name === 'process_cpu_percent'
                      )[0].value
                    }
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
                {snapshotData ? (
                  <Statistic
                    title="process memory percent"
                    value={
                      snapshotData.filter(
                        item => item.metric_name === 'process_memory_percent'
                      )[0].value
                    }
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
                {snapshotData ? (
                  <Statistic
                    title="process net read count"
                    value={
                      snapshotData.filter(
                        item => item.metric_name === 'process_net_read_count'
                      )[0].value
                    }
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
            <Col span={6}>
              <Card loading={loading}>
                {snapshotData ? (
                  <Statistic
                    title="process net write count"
                    value={
                      snapshotData.filter(
                        item => item.metric_name === 'process_net_write_count'
                      )[0].value
                    }
                  />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </MarginRow>
        </>
      )}
    </>
  )
}

export default ProcessDetailPresenter
