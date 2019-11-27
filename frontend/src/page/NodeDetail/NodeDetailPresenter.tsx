import React from 'react'
import { Breadcrumb, Row, Col, Card, Skeleton, Empty, Tag } from 'antd'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import * as Highcharts from 'highcharts'
import { ColumnProps } from 'antd/es/table'
import keys from 'lodash-es/keys'
import { match } from 'react-router'
import LineChart from '../../components/LineChart'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'
import SelectDate from '../../components/SelectDate'
import {
  IsnapshotNodeObjectData,
  IsnapshotNodeContainerData,
  IsnapshotNodeContainerObjectData,
  IsnapshotNodeProcessData,
  IsnapshotNodeProcessObjectData
} from '../../apis/snapshot'

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
  .right-box {
    display: flex;
  }
  .ant-tag {
    padding-top: 5px;
    height: 32px;
  }
`

const LinkTitle = styled(Link)`
  .ant-typography {
    color: #1890ff !important;
  }
`

interface Iparams {
  clusterId: string | undefined
  nodeId: string | undefined
}

interface Iprops {
  match: match<Iparams> | null
  loading: boolean
  snapshotData: IsnapshotNodeObjectData | null
  ChangeChartDateRange: (value: any) => void
  cpuChartConfig: Highcharts.Options | null
  memoryChartConfig: Highcharts.Options | null
  diskChartConfig: Highcharts.Options | null
  nodeContainersData: IsnapshotNodeContainerData[][] | null
  nodeContainerColumns: ColumnProps<IsnapshotNodeContainerObjectData>[]
  nodeProcessesData: IsnapshotNodeProcessData[][] | null
  nodeProcessColumns: ColumnProps<IsnapshotNodeProcessObjectData>[]
  dbQueryTime: string | null
}

const NodeDetailPresenter = ({
  match,
  loading,
  snapshotData,
  ChangeChartDateRange,
  cpuChartConfig,
  memoryChartConfig,
  diskChartConfig,
  nodeContainersData,
  nodeContainerColumns,
  nodeProcessesData,
  nodeProcessColumns,
  dbQueryTime
}: Iprops) => {
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
              <Link to="/nodes">Node List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {snapshotData && keys(snapshotData)[0]}
            </Breadcrumb.Item>
          </Breadcrumb>
          <ChartTitleContainer>
            <TitleContainer
              level={2}
              text={snapshotData && keys(snapshotData)[0]}
            />
            <div className="right-box">
              {dbQueryTime && <Tag color="#f50">{dbQueryTime}</Tag>}
              <SelectDate onChange={ChangeChartDateRange} />
            </div>
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
              <Card title="Disk" bordered={false}>
                {diskChartConfig && keys(diskChartConfig).length !== 0 ? (
                  <LineChart config={diskChartConfig} />
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={24}>
              <TitleContainer level={2} text={'Container List'} />
              {nodeContainersData && match ? (
                nodeContainersData.map(item => {
                  return (
                    <>
                      <LinkTitle
                        to={`/nodes/${match.params.nodeId}/container/${item[0].container_id}`}
                        key={item[0].container_id}
                      >
                        <TitleContainer
                          level={4}
                          text={`${item[0].container}`}
                          key={item[0].container_id}
                        />
                      </LinkTitle>
                      <TableContainer
                        rowKey={'metric_name'}
                        columns={nodeContainerColumns}
                        data={item}
                      />
                    </>
                  )
                })
              ) : (
                <Empty />
              )}
            </Col>
          </MarginRow>
          <MarginRow gutter={16}>
            <Col span={24}>
              <TitleContainer level={2} text={'Process List'} />
              {nodeProcessesData && match ? (
                nodeProcessesData.map(item => {
                  return (
                    <>
                      <LinkTitle
                        to={`/nodes/${match.params.nodeId}/process/${item[0].process_id}`}
                        key={item[0].process_id}
                      >
                        <TitleContainer
                          level={4}
                          key={item[0].process}
                          text={`${item[0].process}`}
                        />
                      </LinkTitle>
                      <TableContainer
                        rowKey={'metric_name'}
                        columns={nodeProcessColumns}
                        data={item}
                      />
                    </>
                  )
                })
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

export default NodeDetailPresenter
