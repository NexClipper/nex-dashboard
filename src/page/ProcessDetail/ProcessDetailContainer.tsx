import React, { useState, useEffect, useCallback } from 'react'
import ProcessDetailPresenter from './ProcessDetailPresenter'
import { useRouteMatch } from 'react-router-dom'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import values from 'lodash-es/values'
import useInterval from '../../utils/useInterval'
import {
  getSnapshotNodeProcess,
  IsnapshotNodeProcessData
} from '../../apis/snapshot'
import { getMetricsNodeProcess } from '../../apis/metrics'
import { IchartDateRange } from '../../types/dateRange'
import { clusterStroe } from '../../store'

dayjs.extend(utc)

interface Iparams {
  nodeId: string | undefined
  processId: string | undefined
}

const ProcessDetailContainer = () => {
  const selectedClusterId = clusterStroe.id
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
    value: 15,
    unit: 'minute'
  })
  const [chartTickInterval, setChartTickInterval] = useState(1)
  const [dbQueryTime, setdbQueryTime] = useState<string | null>(null)

  const ChangeChartDateRange = (value: any) => {
    setChartDateRange({
      value: Number(value.split(' ')[0]),
      unit: value.split(' ')[1]
    })
  }

  const fetchData = useCallback(async () => {
    try {
      const { data: processSnapShotResponse } = await getSnapshotNodeProcess(
        selectedClusterId,
        Number(match && match.params.nodeId),
        Number(match && match.params.processId)
      )
      let processSnapShotResponseArray: IsnapshotNodeProcessData[] = []
      processSnapShotResponseArray = processSnapShotResponseArray.concat(
        ...values(processSnapShotResponse)
      )
      setSnapshotData(processSnapShotResponseArray)
    } catch (error) {
      setError(error)
    }
    try {
      const processMetricResponse = await getMetricsNodeProcess(
        selectedClusterId,
        Number(match && match.params.nodeId),
        Number(match && match.params.processId),
        `dateRange=${dayjs
          .utc()
          .subtract(chartDateRange.value, chartDateRange.unit)
          .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs
          .utc()
          .format(
            'YYYY-MM-DD HH:mm:ss'
          )}&metricNames=process_cpu_user_load&metricNames=process_cpu_system_load&
          metricNames=process_memory_percent&metricNames=process_memory_rss&metricNames=process_memory_data&metricNames=process_memory_stack&metricNames=process_memory_swap&metricNames=process_net_write_bytes&metricNames=process_net_read_bytes`
      )
      setdbQueryTime(processMetricResponse.db_query_time)
      const processCpuUserLoad = processMetricResponse.data.filter(
        item => item.metric_name === 'process_cpu_user_load'
      )
      const processCpuSystemLoad = processMetricResponse.data.filter(
        item => item.metric_name === 'process_cpu_system_load'
      )
      const processMemoryRss = processMetricResponse.data.filter(
        item => item.metric_name === 'process_memory_rss'
      )
      const processMemoryData = processMetricResponse.data.filter(
        item => item.metric_name === 'process_memory_data'
      )
      const processMemoryStack = processMetricResponse.data.filter(
        item => item.metric_name === 'process_memory_stack'
      )
      const processMemorySwap = processMetricResponse.data.filter(
        item => item.metric_name === 'process_memory_swap'
      )
      const processNetWriteBytes = processMetricResponse.data.filter(
        item => item.metric_name === 'process_net_write_bytes'
      )
      const processNetReadBytes = processMetricResponse.data.filter(
        item => item.metric_name === 'process_net_read_bytes'
      )
      if (processCpuUserLoad) {
        const CpuChartConfig: Highcharts.Options = {
          xAxis: {
            type: 'datetime',
            categories: processCpuUserLoad.map(item =>
              dayjs(item.bucket)
                .local()
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
                .local()
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
                .local()
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
    <ProcessDetailPresenter
      loading={loading}
      match={match}
      snapshotData={snapshotData}
      ChangeChartDateRange={ChangeChartDateRange}
      cpuChartConfig={cpuChartConfig}
      memoryChartConfig={memoryChartConfig}
      networkChartConfig={networkChartConfig}
      dbQueryTime={dbQueryTime}
    />
  )
}

export default ProcessDetailContainer
