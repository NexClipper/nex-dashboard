import React, { useState, useEffect, useCallback } from 'react'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { ColumnProps } from 'antd/es/table'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import * as Highcharts from 'highcharts'
import values from 'lodash-es/values'
import { IsummaryClustersData, getSummaryCluster } from '../../apis/summary'
import ClusterDetailPresenter from './ClusterDetailPresenter'
import useInterval from '../../utils/useInterval'
import {
  IclusterNodesData,
  getClusterNodes,
  getClusters
} from '../../apis/clusters'
import { getMetricsPods, getMetricsSummary } from '../../apis/metrics'
import { setCluster } from '../../reducers/cluster'
import { IbreadcrumbDropdownMenu } from '../../components/BreadcrumbDropdown'
import { IchartDateRange } from '../../types/dateRange'

dayjs.extend(utc)

interface Iparams {
  clusterId: string | undefined
}

const ClusterDetailContainer = () => {
  const selectedClusterTitle = useSelector(
    (state: RootState) => state.cluster.name
  )
  const dispatch = useDispatch()
  const match = useRouteMatch<Iparams>('/clusters/:clusterId')
  const location = useLocation()
  const [nodeListData, setNodeListData] = useState<IclusterNodesData[] | null>(
    null
  )
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
  const [usageData, setUsageData] = useState<IsummaryClustersData[] | null>(
    null
  )
  const [dbQueryTime, setdbQueryTime] = useState<string | null>(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartDateRange, setChartDateRange] = useState<IchartDateRange>({
    value: 15,
    unit: 'minute'
  })
  const [chartTickInterval, setChartTickInterval] = useState(90)
  const [dropdownList, setDropdownList] = useState<
    IbreadcrumbDropdownMenu[] | null
  >(null)
  const nodeListColumns: ColumnProps<IclusterNodesData>[] = [
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (value, _, index) =>
        nodeListData &&
        match && <Link to={`/nodes/${nodeListData[index].id}`}>{value}</Link>,
      width: 130,
      align: 'center',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const hostA = a.host.toUpperCase()
        const hostB = b.host.toUpperCase()
        if (hostA < hostB) return -1
        if (hostA > hostB) return 1
        return 0
      }
    },
    {
      title: 'Ip',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
      align: 'center'
    },
    {
      title: 'OS',
      dataIndex: 'os',
      key: 'os',
      width: 100,
      align: 'center'
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      align: 'center'
    },
    {
      title: 'Platform Family',
      dataIndex: 'platform_family',
      key: 'platform_family',
      align: 'center'
    },
    {
      title: 'Platform Version',
      dataIndex: 'platform_version',
      key: 'platform_version',
      align: 'center'
    }
  ]

  const ChangeChartDateRange = (value: any) => {
    setChartDateRange({
      value: Number(value.split(' ')[0]),
      unit: value.split(' ')[1]
    })
    switch (value.split(' ')[1]) {
      case 'hour':
        setChartTickInterval(90)
        break
      case 'day':
        setChartTickInterval(20)
        break
      case 'month':
        setChartTickInterval(1)
        break
      default:
        setChartTickInterval(90)
    }
  }
  const fetchData = useCallback(async () => {
    try {
      const { data: ClustersResponse } = await getClusters()
      let DropDwonList: IbreadcrumbDropdownMenu[] = []
      ClustersResponse.map(item =>
        DropDwonList.push({
          id: item.id,
          link: `/clusters/${item.id}`,
          text: item.name
        })
      )
      match &&
        match.params.clusterId &&
        dispatch(
          setCluster(Number(match.params.clusterId), ClustersResponse[0].name)
        )
      setDropdownList(DropDwonList)
    } catch (error) {
      setError(error)
    }
    try {
      const metricNodeDataResponse = await getMetricsSummary(
        Number(match && match.params.clusterId),
        `dateRange=${dayjs
          .utc()
          .subtract(chartDateRange.value, chartDateRange.unit)
          .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs
          .utc()
          .format(
            'YYYY-MM-DD HH:mm:ss'
          )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15&metricNames=node_disk_total&metricNames=node_disk_free&metricNames=node_disk_used&granularity=${
          chartDateRange.value
        }${chartDateRange.unit}`
      )
      setdbQueryTime(metricNodeDataResponse.db_query_time)
      const nodeCpuLoadAvg1 = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_cpu_load_avg_1'
      )
      const nodeCpuLoadAvg5 = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_cpu_load_avg_5'
      )
      const nodeCpuLoadAvg15 = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_cpu_load_avg_15'
      )
      const nodeMemoryTotal = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_memory_total'
      )
      const nodeMemoryUsed = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_memory_used'
      )
      const nodeDiskTotal = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_disk_total'
      )
      const nodeDiskFree = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_disk_total'
      )
      const nodeDiskUsed = metricNodeDataResponse.data.filter(
        item => item.metric_name === 'node_disk_used'
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
        setCpuChartConfig(
          metricNodeDataResponse.data.length !== 0 ? CpuChartConfig : null
        )
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
          metricNodeDataResponse.data.length !== 0 ? MemoryChartConfig : null
        )
        const DiskChartConfig: Highcharts.Options = {
          xAxis: {
            type: 'datetime',
            categories: nodeDiskTotal.map(item =>
              dayjs(item.bucket)
                .local()
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
          metricNodeDataResponse.data.length !== 0 ? DiskChartConfig : null
        )
      }
    } catch (error) {
      setError(error)
    }
    try {
      const {
        data: {
          data: { data: nodeListResponse }
        }
      } = await getClusterNodes(Number(match && match.params.clusterId))
      setNodeListData(nodeListResponse)
      const { data: clusterSummaryResponse } = await getSummaryCluster(
        Number(match && match.params.clusterId)
      )
      let summaryData: IsummaryClustersData[] = []
      summaryData = summaryData.concat(...values(clusterSummaryResponse))
      setUsageData(summaryData.length !== 0 ? summaryData : null)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [chartDateRange, location])

  useEffect(() => {
    fetchData()
  }, [chartDateRange, location])

  useInterval(() => (!loading && !error ? fetchData() : null), 10000)
  return (
    <ClusterDetailPresenter
      loading={loading}
      dropdownList={dropdownList}
      selectedClusterTitle={selectedClusterTitle}
      usageData={usageData}
      match={match}
      nodeListData={nodeListData}
      nodeListColumns={nodeListColumns}
      ChangeChartDateRange={ChangeChartDateRange}
      cpuChartConfig={cpuChartConfig}
      memoryChartConfig={memoryChartConfig}
      diskChartConfig={diskChartConfig}
      dbQueryTime={dbQueryTime}
    />
  )
}

export default ClusterDetailContainer
