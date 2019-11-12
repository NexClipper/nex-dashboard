import React, { useState, useEffect, useCallback } from 'react'
import { Link, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../reducers'
import { ColumnProps } from 'antd/es/table'
import dayjs, { OpUnitType } from 'dayjs'
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
import { getMetricsNodes, getMetricsPods } from '../../apis/metrics'
import { setCluster } from '../../reducers/cluster'
import { IbreadcrumbDropdownMenu } from '../../components/BreadcrumbDropdown'

dayjs.extend(utc)

interface IchartDateRange {
  value: number
  unit: OpUnitType
}

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
    podChartConfig,
    setPodChartConfig
  ] = useState<Highcharts.Options | null>(null)
  const [usageData, setUsageData] = useState<IsummaryClustersData[] | null>(
    null
  )
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartDateRange, setChartDateRange] = useState<IchartDateRange>({
    value: 1,
    unit: 'hour'
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
      align: 'center'
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
      if (match) {
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
        const { data: metricNodeDataResponse } = await getMetricsNodes(
          Number(match.params.clusterId),
          `dateRange=${dayjs(Date.now())
            .subtract(chartDateRange.value, chartDateRange.unit)
            .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
            Date.now()
          ).format(
            'YYYY-MM-DD HH:mm:ss'
          )}&&metricNames=node_memory_used&metricNames=node_memory_total&metricNames=node_cpu_load_avg_1&metricNames=node_cpu_load_avg_5&metricNames=node_cpu_load_avg_15&timezone=Asia/Seoul&granularity=${
            chartDateRange.value
          }${chartDateRange.unit}`
        )
        const nodeCpuLoadAvg1 = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_1'
        )
        const nodeCpuLoadAvg5 = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_5'
        )
        const nodeCpuLoadAvg15 = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_cpu_load_avg_15'
        )
        const nodeMemoryTotal = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_memory_total'
        )
        const nodeMemoryUsed = metricNodeDataResponse.filter(
          item => item.metric_name === 'node_memory_used'
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
            metricNodeDataResponse.length !== 0 ? CpuChartConfig : null
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
            metricNodeDataResponse.length !== 0 ? MemoryChartConfig : null
          )
          const {
            data: {
              data: { data: nodeListResponse }
            }
          } = await getClusterNodes(Number(match.params.clusterId))
          setNodeListData(nodeListResponse)
          const { data: clusterSummaryResponse } = await getSummaryCluster(
            Number(match.params.clusterId)
          )
          let summaryData: IsummaryClustersData[] = []
          summaryData = summaryData.concat(...values(clusterSummaryResponse))
          setUsageData(summaryData.length !== 0 ? summaryData : null)
          const { data: metricPodsDataResponse } = await getMetricsPods(
            Number(match.params.clusterId),
            `dateRange=${dayjs(Date.now())
              .subtract(chartDateRange.value, chartDateRange.unit)
              .format('YYYY-MM-DD HH:mm:ss')}&dateRange=${dayjs(
              Date.now()
            ).format(
              'YYYY-MM-DD HH:mm:ss'
            )}&metricNames=container_memory_rss&metricNames=container_cpu_usage_total&timezone=Asia/Seoul&granularity=${
              chartDateRange.value
            }${chartDateRange.unit}`
          )
          const containerMemoryRss = metricPodsDataResponse.filter(
            item => item.metric_name === 'container_memory_rss'
          )
          const containerCpuUsageTotal = metricPodsDataResponse.filter(
            item => item.metric_name === 'container_cpu_usage_total'
          )
          const PodChartConfig: Highcharts.Options = {
            xAxis: {
              type: 'datetime',
              categories: containerMemoryRss.map(item =>
                dayjs(item.bucket)
                  .utc()
                  .format('YY-M-D HH:mm:ss')
              ),
              tickInterval: chartTickInterval * 5
            },
            series: [
              {
                type: 'line',
                name: 'container_memory_rss',
                data: containerMemoryRss.map(item => item.value)
              },
              {
                type: 'line',
                name: 'container_cpu_usage_total',
                data: containerCpuUsageTotal.map(item => item.value)
              }
            ]
          }
          setPodChartConfig(
            metricPodsDataResponse.length !== 0 ? PodChartConfig : null
          )
        }
      }
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
      podChartConfig={podChartConfig}
    />
  )
}

export default ClusterDetailContainer
