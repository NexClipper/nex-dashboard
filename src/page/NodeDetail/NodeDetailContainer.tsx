import React, { useState, useEffect, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import NodeDetailPresenter from './NodeDetailPresenter'
import utc from 'dayjs/plugin/utc'
import { ColumnProps } from 'antd/es/table'
import values from 'lodash-es/values'
import { RootState } from '../../reducers'
import {
  IsnapshotNodeObjectData,
  getSnapshotNode,
  getSnapshotNodeContainers,
  IsnapshotNodeContainerObjectData,
  IsnapshotNodeProcessObjectData,
  getSnapshotNodeProcesses,
  IsnapshotNodeProcessData,
  IsnapshotNodeContainerData
} from '../../apis/snapshot'
import { getMetricsNode } from '../../apis/metrics'
import useInterval from '../../utils/useInterval'
import { IchartDateRange } from '../../types/dateRange'

dayjs.extend(utc)

interface Iparams {
  clusterId: string | undefined
  nodeId: string | undefined
}

const nodeContainerColumns: ColumnProps<IsnapshotNodeContainerObjectData>[] = [
  {
    title: 'Metric Name',
    dataIndex: 'metric_name',
    key: 'metric_name',
    align: 'center',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => {
      const metricNameA = a.metric_name
      const metricNameB = b.metric_name
      if (metricNameA < metricNameB) return -1
      if (metricNameA > metricNameB) return 1
      return 0
    }
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    align: 'center'
  },
  {
    title: 'Metric Label',
    dataIndex: 'metric_label',
    key: 'metric_label',
    align: 'center'
  },
  {
    title: 'Date',
    dataIndex: 'ts',
    key: 'ts',
    align: 'center'
  }
]

const nodeProcessColumns: ColumnProps<IsnapshotNodeProcessObjectData>[] = [
  {
    title: 'Metric Name',
    dataIndex: 'metric_name',
    key: 'metric_name',
    align: 'center',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => {
      const metricNameA = a.metric_name
      const metricNameB = b.metric_name
      if (metricNameA < metricNameB) return -1
      if (metricNameA > metricNameB) return 1
      return 0
    }
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
    align: 'center'
  },
  {
    title: 'Metric Label',
    dataIndex: 'metric_label',
    key: 'metric_label',
    align: 'center'
  },
  {
    title: 'Date',
    dataIndex: 'ts',
    key: 'ts',
    align: 'center'
  }
]

const NodeDetailContainer = () => {
  const selectedClusterId = useSelector((state: RootState) => state.cluster.id)
  const match = useRouteMatch<Iparams>('/nodes/:nodeId')
  const [
    snapshotData,
    setSnapshotData
  ] = useState<IsnapshotNodeObjectData | null>(null)
  const [
    cpuChartConfig,
    setCpuChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [
    memoryChartConfig,
    setMemoryChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [nodeContainersData, setNodeContainersData] = useState<
    IsnapshotNodeContainerData[][] | null
  >(null)
  const [nodeProcessesData, setNodeProcessesData] = useState<
    IsnapshotNodeProcessData[][] | null
  >(null)
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
      const metricDataResponse = await getMetricsNode(
        selectedClusterId,
        Number(match && match.params.nodeId),
        `dateRange=${dayjs
          .utc()
          .subtract(chartDateRange.value, chartDateRange.unit)
          .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs
          .utc()
          .format(
            'YYYY-MM-DD HH:mm:ss'
          )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15&granularity=${
          chartDateRange.value
        }${chartDateRange.unit}`
      )
      setdbQueryTime(metricDataResponse.db_query_time)
      const nodeCpuLoadAvg1 = metricDataResponse.data.filter(
        item => item.metric_name === 'node_cpu_load_avg_1'
      )
      const nodeCpuLoadAvg5 = metricDataResponse.data.filter(
        item => item.metric_name === 'node_cpu_load_avg_5'
      )
      const nodeCpuLoadAvg15 = metricDataResponse.data.filter(
        item => item.metric_name === 'node_cpu_load_avg_15'
      )
      const nodeMemoryTotal = metricDataResponse.data.filter(
        item => item.metric_name === 'node_memory_total'
      )
      const nodeMemoryUsed = metricDataResponse.data.filter(
        item => item.metric_name === 'node_memory_used'
      )
      if (nodeCpuLoadAvg1) {
        const CpuChartConfig: Highcharts.Options = {
          xAxis: {
            type: 'datetime',
            categories: nodeCpuLoadAvg1.map(item =>
              dayjs(item.bucket)
                .local()
                .format('YY-M-D HH:mm:ss')
            ),
            tickInterval: chartTickInterval
          },
          series: [
            {
              type: 'line',
              name: 'node_cpu_load_avg_1',
              data: nodeCpuLoadAvg1.map(item => item.value)
            },
            {
              type: 'line',
              name: 'node_cpu_load_avg_5',
              data: nodeCpuLoadAvg5.map(item => item.value)
            },
            {
              type: 'line',
              name: 'node_cpu_load_avg_15',
              data: nodeCpuLoadAvg15.map(item => item.value)
            }
          ]
        }
        setCpuChartConfig(nodeCpuLoadAvg1.length !== 0 ? CpuChartConfig : null)
        const MemoryChartConfig: Highcharts.Options = {
          xAxis: {
            type: 'datetime',
            categories: nodeMemoryTotal.map(item =>
              dayjs(item.bucket)
                .local()
                .format('YY-M-D HH:mm:ss')
            ),
            tickInterval: chartTickInterval
          },
          series: [
            {
              type: 'line',
              name: 'node_memory_total',
              data: nodeMemoryTotal.map(item => item.value)
            },
            {
              type: 'line',
              name: 'node_memory_used',
              data: nodeMemoryUsed.map(item => item.value)
            }
          ]
        }
        setMemoryChartConfig(
          nodeMemoryTotal.length !== 0 ? MemoryChartConfig : null
        )
      }
    } catch (error) {
      setError(error)
    }
    try {
      const { data: snapShotResponse } = await getSnapshotNode(
        selectedClusterId,
        Number(match && match.params.nodeId)
      )
      setSnapshotData(snapShotResponse)
    } catch (error) {
      setError(error)
    }
    try {
      const {
        data: snapShotContainersResponse
      } = await getSnapshotNodeContainers(
        selectedClusterId,
        Number(match && match.params.nodeId)
      )
      const filterSnapShotContainersResponse = values(
        snapShotContainersResponse
      ).map(responseItem =>
        responseItem.filter(
          item =>
            item.metric_name === 'container_cpu_usage_user' ||
            item.metric_name === 'container_cpu_usage_system' ||
            item.metric_name === 'container_memory_rss'
        )
      )
      setNodeContainersData(filterSnapShotContainersResponse)
    } catch (error) {
      setError(error)
    }
    try {
      const {
        data: snapShotProcessesResponse
      } = await getSnapshotNodeProcesses(
        selectedClusterId,
        Number(match && match.params.nodeId)
      )
      const filterSnapShotProcessesResponse = values(
        snapShotProcessesResponse
      ).map(responseItem =>
        responseItem.filter(
          item =>
            item.metric_name === 'process_cpu_user_load' ||
            item.metric_name === 'process_cpu_system_load' ||
            item.metric_name === 'process_memory_rss'
        )
      )
      setNodeProcessesData(filterSnapShotProcessesResponse)
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
    <NodeDetailPresenter
      match={match}
      loading={loading}
      snapshotData={snapshotData}
      ChangeChartDateRange={ChangeChartDateRange}
      cpuChartConfig={cpuChartConfig}
      memoryChartConfig={memoryChartConfig}
      nodeContainersData={nodeContainersData}
      nodeContainerColumns={nodeContainerColumns}
      nodeProcessesData={nodeProcessesData}
      nodeProcessColumns={nodeProcessColumns}
      dbQueryTime={dbQueryTime}
    />
  )
}

export default NodeDetailContainer
