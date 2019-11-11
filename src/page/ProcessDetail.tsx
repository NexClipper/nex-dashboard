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
  getSnapshotNodeProcess,
  IsnapshotNodeProcessData
} from '../apis/snapshot'
import { getMetricsNodeProcess } from '../apis/metrics'

dayjs.extend(utc)

interface Iparams {
  nodeId: string | undefined
  processId: string | undefined
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

const ProcessDetail = () => {
  const selectedClusterId = useSelector((state: RootState) => state.cluster.id)
  const match = useRouteMatch<Iparams>('/nodes/:nodeId/process/:processId')
  const [snapshotData, setSnapshotData] = useState<
    IsnapshotNodeProcessData[] | null
  >(null)
  const [
    cpuChartConfig,
    setCpuChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    memoryChartConfig,
    setMemoryChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    networkChartConfig,
    setNetworkChartConfig
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
        const { data: processSnapShotResponse } = await getSnapshotNodeProcess(
          selectedClusterId,
          Number(match.params.nodeId),
          Number(match.params.processId)
        )
        let processSnapShotResponseArray: IsnapshotNodeProcessData[] = []
        processSnapShotResponseArray = processSnapShotResponseArray.concat(
          ...values(processSnapShotResponse)
        )
        const { data: processMetricResponse } = await getMetricsNodeProcess(
          selectedClusterId,
          Number(match.params.nodeId),
          Number(match.params.processId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&metricNames=process_cpu_user_load&metricNames=process_cpu_system_load&
          metricNames=process_memory_percent&metricNames=process_memory_rss&metricNames=process_memory_data&metricNames=process_memory_stack&metricNames=process_memory_swap&metricNames=process_net_write_bytes&metricNames=process_net_read_bytes&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.unit}`
        )
        const processCpuUserLoad = processMetricResponse.filter(
          item => item.metric_name === 'process_cpu_user_load'
        )
        const processCpuSystemLoad = processMetricResponse.filter(
          item => item.metric_name === 'process_cpu_system_load'
        )
        const processMemoryRss = processMetricResponse.filter(
          item => item.metric_name === 'process_memory_rss'
        )
        const processMemoryData = processMetricResponse.filter(
          item => item.metric_name === 'process_memory_data'
        )
        const processMemoryStack = processMetricResponse.filter(
          item => item.metric_name === 'process_memory_stack'
        )
        const processMemorySwap = processMetricResponse.filter(
          item => item.metric_name === 'process_memory_swap'
        )
        const processNetWriteBytes = processMetricResponse.filter(
          item => item.metric_name === 'process_net_write_bytes'
        )
        const processNetReadBytes = processMetricResponse.filter(
          item => item.metric_name === 'process_net_read_bytes'
        )
        setSnapshotData(processSnapShotResponseArray)
        if (processCpuUserLoad) {
          const CpuChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: processCpuUserLoad.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'process_cpu_user_load',
                data: processCpuUserLoad.map(item => item.value)
              },
              {
                type: 'line',
                name: 'process_cpu_system_load',
                data: processCpuSystemLoad.map(item => item.value)
              }
            ]
          }
          setCpuChartConfig(
            processCpuUserLoad.length !== 0 ? CpuChartConfig : null
          )
        }
        if (processMemoryRss) {
          const memoryChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: processMemoryRss.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'process_memory_rss',
                data: processMemoryRss.map(item => item.value)
              },
              {
                type: 'line',
                name: 'process_memory_data',
                data: processMemoryData.map(item => item.value)
              },
              {
                type: 'line',
                name: 'process_memory_stack',
                data: processMemoryStack.map(item => item.value)
              },
              {
                type: 'line',
                name: 'process_memory_swap',
                data: processMemorySwap.map(item => item.value)
              }
            ]
          }
          setMemoryChartConfig(
            processMemoryRss.length !== 0 ? memoryChartConfig : null
          )
        }
        if (processNetWriteBytes) {
          const NetworkChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: processNetWriteBytes.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'process_net_write_bytes',
                data: processNetWriteBytes.map(item => item.value)
              },
              {
                type: 'line',
                name: 'process_net_read_bytes',
                data: processNetReadBytes.map(item => item.value)
              }
            ]
          }
          setNetworkChartConfig(
            processNetWriteBytes.length !== 0 ? NetworkChartConfig : null
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

export default ProcessDetail
