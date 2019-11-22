import React, { useState, useEffect, useCallback } from 'react'
import useInterval from '../../utils/useInterval'
import { IcidentsBasicData, getIncidentsBasic } from '../../apis/incidents'
import { ColumnProps } from 'antd/es/table'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import EventsPresenter from './EventsPresenter'
import { clusterStroe } from '../../store'

dayjs.extend(utc)

const EventsContainer = () => {
  clusterStroe.setCluster(1, '')
  const [incidentsData, setIncidentsData] = useState<
    IcidentsBasicData[] | null
  >(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const cidentsColumns: ColumnProps<IcidentsBasicData>[] = [
    {
      title: 'ClusterId',
      dataIndex: 'ClusterId',
      key: 'ClusterId',
      align: 'center'
    },
    {
      title: 'NodeId',
      dataIndex: 'NodeId',
      key: 'NodeId',
      align: 'center'
    },
    {
      title: 'TargetType',
      dataIndex: 'TargetType',
      key: 'TargetType',
      align: 'center'
    },
    {
      title: 'Target',
      dataIndex: 'Target',
      key: 'Target',
      align: 'center'
    },
    {
      title: 'Value',
      dataIndex: 'Value',
      key: 'Value',
      align: 'center'
    },
    {
      title: 'EventName',
      dataIndex: 'EventName',
      key: 'EventName',
      align: 'center'
    },
    {
      title: 'ReportedTs',
      dataIndex: 'ReportedTs',
      key: 'ReportedTs',
      align: 'center',
      render: value =>
        dayjs(value)
          .local()
          .format('YY-M-D HH:mm:ss')
    },
    {
      title: 'DetectedTs',
      dataIndex: 'DetectedTs',
      key: 'DetectedTs',
      align: 'center',
      render: value =>
        dayjs(value)
          .local()
          .format('YY-M-D HH:mm:ss.SSS')
    }
  ]

  const fetchData = useCallback(async () => {
    try {
      const { data: incidentsDataResponse } = await getIncidentsBasic()
      setIncidentsData(incidentsDataResponse)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  useInterval(() => (!loading && !error ? fetchData() : null), 1000)

  return (
    <EventsPresenter
      loading={loading}
      incidentsData={incidentsData}
      cidentsColumns={cidentsColumns}
    />
  )
}

export default EventsContainer
