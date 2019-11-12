import React, { useState, useEffect, useCallback } from 'react'
import { useRouteMatch } from 'react-router-dom'
import * as Highcharts from 'highcharts'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import NodeDetailPresenter from './NodeDetailPresenter'
import utc from 'dayjs/plugin/utc'
import { ColumnProps } from 'antd/es/table'
import { OpUnitType } from 'dayjs'
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

dayjs.extend(utc)

interface Iparams {
  clusterId: string | undefined
  nodeId: string | undefined
}

interface IchartDateRange {
  value: number
  unit: OpUnitType
}

const nodeContainerColumns: ColumnProps<IsnapshotNodeContainerObjectData>[] = [
  {
    title: 'Metric Name',
    dataIndex: 'metric_name',
    key: 'metric_name',
    align: 'center'
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
    align: 'center'
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
  const [
    diskChartConfig,
    setDiskChartConfig
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
        const { data: metricDataResponse } = await getMetricsNode(
          selectedClusterId,
          Number(match.params.nodeId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15&metricNames=node_disk_total&metricNames=node_disk_free&metricNames=node_disk_used&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.unit}`
        )
        const nodeCpuLoadAvg1 = metricDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_1'
        )
        const nodeCpuLoadAvg5 = metricDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_5'
        )
        const nodeCpuLoadAvg15 = metricDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_15'
        )
        const nodeMemoryTotal = metricDataResponse.filter(
          item => item.metric_name === 'node_memory_total'
        )
        const nodeMemoryUsed = metricDataResponse.filter(
          item => item.metric_name === 'node_memory_used'
        )
        const nodeDiskTotal = metricDataResponse.filter(
          item => item.metric_name === 'node_disk_total'
        )
        const nodeDiskFree = metricDataResponse.filter(
          item => item.metric_name === 'node_disk_free'
        )
        const nodeDiskUsed = metricDataResponse.filter(
          item => item.metric_name === 'node_disk_used'
        )
        if (nodeCpuLoadAvg1) {
          const CpuChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: nodeCpuLoadAvg1.map(item =>
                dayjs(item.bucket)
                  .utc()
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
          setCpuChartConfig(
            nodeCpuLoadAvg1.length !== 0 ? CpuChartConfig : null
          )
          const MemoryChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: nodeMemoryTotal.map(item =>
                dayjs(item.bucket)
                  .utc()
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
          const DiskChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: nodeDiskTotal.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval
            },
            series: [
              {
                type: 'line',
                name: 'node_disk_total',
                data: nodeDiskTotal.map(item => item.value)
              },
              {
                type: 'line',
                name: 'node_disk_free',
                data: nodeDiskFree.map(item => item.value)
              },
              {
                type: 'line',
                name: 'node_disk_used',
                data: nodeDiskUsed.map(item => item.value)
              }
            ]
          }
          setDiskChartConfig(
            nodeDiskTotal.length !== 0 ? DiskChartConfig : null
          )
          const { data: snapShotResponse } = await getSnapshotNode(
            selectedClusterId,
            Number(match.params.nodeId)
          )
          const {
            data: snapShotContainersResponse
          } = await getSnapshotNodeContainers(
            selectedClusterId,
            Number(match.params.nodeId)
          )
          const {
            data: snapShotProcessesResponse
          } = await getSnapshotNodeProcesses(
            selectedClusterId,
            Number(match.params.nodeId)
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
          setSnapshotData(snapShotResponse)
          setNodeContainersData(filterSnapShotContainersResponse)
          setNodeProcessesData(filterSnapShotProcessesResponse)
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
    <NodeDetailPresenter
      match={match}
      loading={loading}
      snapshotData={snapshotData}
      ChangeChartDateRange={ChangeChartDateRange}
      cpuChartConfig={cpuChartConfig}
      memoryChartConfig={memoryChartConfig}
      diskChartConfig={diskChartConfig}
      nodeContainersData={nodeContainersData}
      nodeContainerColumns={nodeContainerColumns}
      nodeProcessesData={nodeProcessesData}
      nodeProcessColumns={nodeProcessColumns}
    />
  )
}

export default NodeDetailContainer
