import React from 'react'
import { Breadcrumb, Skeleton, Row, Col, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import { IcidentsBasicData } from '../../apis/incidents'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'

interface Iprops {
  loading: boolean
  incidentsData: IcidentsBasicData[] | null
  cidentsColumns: ColumnProps<IcidentsBasicData>[]
}

const EventsPresenter = ({
  loading,
  incidentsData,
  cidentsColumns
}: Iprops) => {
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
            <Breadcrumb.Item>Events</Breadcrumb.Item>
          </Breadcrumb>
          <TitleContainer level={2} text={'Events'} />
          <Row gutter={16}>
            <Col span={24}>
              {incidentsData ? (
                <TableContainer
                  key="id"
                  title={''}
                  columns={cidentsColumns}
                  data={incidentsData}
                />
              ) : (
                <Empty />
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default EventsPresenter
