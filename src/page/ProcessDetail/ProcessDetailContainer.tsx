import React, { useState, useEffect, useCallback } from 'react'
import ProcessDetailPresenter from './ProcessDetailPresenter'
import { useRouteMatch } from 'react-router-dom'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import values from 'lodash-es/values'
import { useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { OpUnitType } from 'dayjs'
import useInterval from '../../utils/useInterval'
import {
  getSnapshotNodeProcess,
  IsnapshotNodeProcessData
} from '../../apis/snapshot'
import { getMetricsNodeProcess } from '../../apis/metrics'

dayjs.extend(utc)

interface Iparams {
  nodeId: string | undefined
  processId: string | undefined
}

interface IchartDateRange {
  value: number
  unit: OpUnitType
}

const ProcessDetailContainer = () => {
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
    <ProcessDetailPresenter
      loading={loading}
      match={match}
      snapshotData={snapshotData}
      ChangeChartDateRange={ChangeChartDateRange}
      cpuChartConfig={cpuChartConfig}
      memoryChartConfig={memoryChartConfig}
      networkChartConfig={networkChartConfig}
    />
  )
}

export default ProcessDetailContainer
