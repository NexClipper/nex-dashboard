import React, { useState, useEffect, useCallback } from 'react'
import { Breadcrumb, Row, Col, Card, Skeleton, Empty, Statistic } from 'antd'
import { useRouteMatch, Link } from 'react-router-dom'
import styled from 'styled-components'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import values from 'lodash-es/values'
import keys from 'lodash-es/keys'
import { useSelector } from 'react-redux'
import { RootState } from '../reducers'
import { OpUnitType } from 'dayjs'
import LineChart from '../components/LineChart'
import TitleContainer from '../components/TitleContainer'
import SelectDate from '../components/SelectDate'
import useInterval from '../utils/useInterval'
import {
  IsnapshotNodeContainerData,
  getSnapshotNodeContainer
} from '../apis/snapshot'
import { logger } from '../utils/logger'
import { getMetricsNodeContainer } from '../apis/metrics'

dayjs.extend(utc)

interface Iparams {
  nodeId: string | undefined
  containerId: string | undefined
}

interface IchartDateRange {
  value: number
  unit: OpUnitType
}

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

const ContainerDetail = () => {
  const selectedClusterId = useSelector((state: RootState) => state.cluster.id)
  const match = useRouteMatch<Iparams>('/nodes/:nodeId/container/:containerId')
  const [snapshotData, setSnapshotData] = useState<
    IsnapshotNodeContainerData[] | null
  >(null)
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
        const {
          data: containerSnapShotResponse
        } = await getSnapshotNodeContainer(
          selectedClusterId,
          Number(match.params.nodeId),
          Number(match.params.containerId)
        )
        let containerSnapShotResponseArray: IsnapshotNodeContainerData[] = []
        containerSnapShotResponseArray = containerSnapShotResponseArray.concat(
          ...values(containerSnapShotResponse)
        )
        setSnapshotData(containerSnapShotResponseArray)
        const { data: containerMetricResponse } = await getMetricsNodeContainer(
          selectedClusterId,
          Number(match.params.nodeId),
          Number(match.params.containerId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&metricNames=container_memory_rss&metricNames=container_memory_rss_total&metricNames=container_cpu_usage_system&metricNames=container_cpu_usage_user&metricNames=container_cpu_usage_total&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.unit}`
        )
        const containerMemoryRss = containerMetricResponse.filter(
          item => item.metric_name === 'container_memory_rss'
        )
        const containerMemoryRssTotal = containerMetricResponse.filter(
          item => item.metric_name === 'container_memory_rss_total'
        )
        const containerCpuUsageSystem = containerMetricResponse.filter(
          item => item.metric_name === 'container_cpu_usage_system'
        )
        const containerCpuUsageUser = containerMetricResponse.filter(
          item => item.metric_name === 'container_cpu_usage_user'
        )
        const containerCpuUsageTotal = containerMetricResponse.filter(
          item => item.metric_name === 'container_cpu_usage_total'
        )
        if (containerCpuUsageTotal) {
          const CpuChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: containerCpuUsageTotal.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'container_cpu_usage_total',
                data: containerCpuUsageTotal.map(item => item.value)
              },
              {
                type: 'line',
                name: 'container_cpu_usage_user',
                data: containerCpuUsageUser.map(item => item.value)
              },
              {
                type: 'line',
                name: 'container_cpu_usage_system',
                data: containerCpuUsageSystem.map(item => item.value)
              }
            ]
          }
          setCpuChartConfig(
            containerCpuUsageTotal.length !== 0 ? CpuChartConfig : null
          )
        }
        if (containerMemoryRss) {
          const MemoryChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: containerMemoryRss.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'container_memory_rss',
                data: containerMemoryRss.map(item => item.value)
              },
              {
                type: 'line',
                name: 'container_memory_rss_total',
                data: containerMemoryRssTotal.map(item => item.value)
              }
            ]
          }
          setMemoryChartConfig(
            containerMemoryRss.length !== 0 ? MemoryChartConfig : null
          )
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
              {snapshotData && snapshotData[0].container}
            </Breadcrumb.Item>
          </Breadcrumb>
          <ChartTitleContainer>
            <TitleContainer
              level={2}
              text={snapshotData && snapshotData[0].container}
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
            <Col span={6}>
              <Card loading={loading}>
                {snapshotData ? (
                  <Statistic
                    title="container memory rss total"
                    value={
                      snapshotData.filter(
                        item =>
                          item.metric_name === 'container_memory_rss_total'
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
                    title="container cpu usage total"
                    value={
                      snapshotData.filter(
                        item => item.metric_name === 'container_cpu_usage_total'
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
                    title="container cpu usage user"
                    value={
                      snapshotData.filter(
                        item => item.metric_name === 'container_cpu_usage_user'
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
                    title="container cpu usage system"
                    value={
                      snapshotData.filter(
                        item =>
                          item.metric_name === 'container_cpu_usage_system'
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

export default ContainerDetail
