import React, { useState, useEffect, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import values from 'lodash-es/values'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import useInterval from '../../utils/useInterval'
import {
  IsnapshotNodeContainerData,
  getSnapshotNodeContainer
} from '../../apis/snapshot'
import { getMetricsNodeContainer } from '../../apis/metrics'
import ContainerDetailPresenter from './ContainerDetailPresenter'
import { IchartDateRange } from '../../types/dateRange'

dayjs.extend(utc)

interface Iparams {
  nodeId: string | undefined
  containerId: string | undefined
}

const ContainerDetailContainer = () => {
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
  const [dbQueryTime, setdbQueryTime] = useState<string | null>(null)

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
      const {
        data: containerSnapShotResponse
      } = await getSnapshotNodeContainer(
        selectedClusterId,
        Number(match && match.params.nodeId),
        Number(match && match.params.containerId)
      )
      let containerSnapShotResponseArray: IsnapshotNodeContainerData[] = []
      containerSnapShotResponseArray = containerSnapShotResponseArray.concat(
        ...values(containerSnapShotResponse)
      )
      setSnapshotData(containerSnapShotResponseArray)
    } catch (error) {
      setError(error)
    }
    try {
      const containerMetricResponse = await getMetricsNodeContainer(
        selectedClusterId,
        Number(match && match.params.nodeId),
        Number(match && match.params.containerId),
        `dateRange=${dayjs
          .utc()
          .subtract(chartDateRange.value, chartDateRange.unit)
          .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs
          .utc()
          .format(
            'YYYY-MM-DD HH:mm:ss'
          )}&metricNames=container_memory_rss&metricNames=container_memory_rss_total&metricNames=container_cpu_usage_system&metricNames=container_cpu_usage_user&metricNames=container_cpu_usage_total&granularity=${
          chartDateRange.value
        }${chartDateRange.unit}`
      )
      setdbQueryTime(containerMetricResponse.db_query_time)
      const containerMemoryRss = containerMetricResponse.data.filter(
        item => item.metric_name === 'container_memory_rss'
      )
      const containerMemoryRssTotal = containerMetricResponse.data.filter(
        item => item.metric_name === 'container_memory_rss_total'
      )
      const containerCpuUsageSystem = containerMetricResponse.data.filter(
        item => item.metric_name === 'container_cpu_usage_system'
      )
      const containerCpuUsageUser = containerMetricResponse.data.filter(
        item => item.metric_name === 'container_cpu_usage_user'
      )
      const containerCpuUsageTotal = containerMetricResponse.data.filter(
        item => item.metric_name === 'container_cpu_usage_total'
      )
      if (containerCpuUsageTotal) {
        const CpuChartConfig: Highcharts.Options = {
          xAxis: {
            type: 'datetime',
            categories: containerCpuUsageTotal.map(item =>
              dayjs(item.bucket)
                .local()
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
                .local()
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
    <ContainerDetailPresenter
      loading={loading}
      match={match}
      snapshotData={snapshotData}
      ChangeChartDateRange={ChangeChartDateRange}
      cpuChartConfig={cpuChartConfig}
      memoryChartConfig={memoryChartConfig}
      dbQueryTime={dbQueryTime}
    />
  )
}

export default ContainerDetailContainer
