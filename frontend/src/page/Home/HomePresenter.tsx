import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { Skeleton, Empty, Breadcrumb } from 'antd'
import keys from 'lodash-es/keys'
import TableContainer from '../../components/TableContainer'
import TitleContainer from '../../components/TitleContainer'
import { IclustersData } from '../../apis/clusters'
import { InodesObjectData, InodesData } from '../../apis/nodes'
import { IagentsObjectData, IagentsData } from '../../apis/agents'

interface Iprops {
  loading: boolean
  clustersData: IclustersData[] | null
  clusterColumns: ColumnProps<IclustersData>[]
  nodesData: InodesObjectData | null
  nodesColumns: ColumnProps<InodelistData>[]
  agentsData: IagentsObjectData | null
  agentsColumns: ColumnProps<IagentListData>[]
}

const HomePresenter = ({
  loading,
  clustersData,
  clusterColumns,
  nodesData,
  nodesColumns,
  agentsData,
  agentsColumns
}: Iprops) => {
  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <TitleContainer level={2} text={'Cluster list'} />
          {clustersData ? (
            <TableContainer
              key="id"
              title={''}
              columns={clusterColumns}
              data={clustersData}
            />
          ) : (
            <Empty />
          )}
          <TitleContainer level={2} text={'Node list'} />
          {nodesData && keys(nodesData).length !== 0 ? (
            Object.entries(nodesData).map(
              ([title, value]: [string, InodesData[]]) => {
                return (
                  <TableContainer
                    key={title}
                    title={title}
                    columns={nodesColumns}
                    data={value}
                  />
                )
              }
            )
          ) : (
            <Empty />
          )}
          <TitleContainer level={2} text={'Agent List'} />
          {agentsData && keys(agentsData).length !== 0 ? (
            Object.entries(agentsData).map(
              ([title, value]: [string, IagentsData[]]) => {
                return (
                  <TableContainer
                    key={title}
                    title={title}
                    columns={agentsColumns}
                    data={value}
                  />
                )
              }
            )
          ) : (
            <Empty />
          )}
        </>
      )}
    </>
  )
}

export default HomePresenter
