import React from 'react'
import { Typography, Row, Col, Card, Tag, Breadcrumb } from 'antd'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import TableContainer from '../components/TableContainer'

const { Title } = Typography

const StatusBox = styled(Card)`
  &.ant-card {
    height: 300px;
    box-sizing: border-box;
    color: #fff;
    text-align: center;
    padding: 32px;
    background-color: ${props => props.color || '#0288d1'};
    font-size: 24px;
  }
  .title {
    line-height: 1.25;
    height: 72px;
    margin-bottom: 16px;
  }
  .number {
    font-size: 64px;
    margin: 0;
  }
`

interface Idata {
  id: number
  name: string
  node_ip: string
  status: object
  conditions: object
}

const columns: ColumnProps<ItableColumns>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    render: id => <Link to={`/node/${id}`}>{id}</Link>
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Status',
    dataIndex: 'conditions.type',
    key: 'conditions.type',
    render: ready => (
      <span>
        {ready === 'Ready' ? (
          <Tag color="#2ecc71">Ready</Tag>
        ) : (
          <Tag color="#e67e22">Not Ready</Tag>
        )}
      </span>
    )
  },
  {
    title: 'Node Ip',
    dataIndex: 'node_ip',
    key: 'node_ip'
  },
  {
    title: 'Allocatable CPU',
    dataIndex: 'status.allocatable.cpu',
    key: 'status.allocatable.cpu'
  },
  {
    title: 'Allocatable Memory',
    dataIndex: 'status.allocatable.memory',
    key: 'status.allocatable.memory'
  },
  {
    title: 'Capacity CPU',
    dataIndex: 'status.capacity.cpu',
    key: 'status.capacity.cpu'
  },
  {
    title: 'Capacity Memory',
    dataIndex: 'status.capacity.memory',
    key: 'status.capacity.memory'
  }
]

const data: Idata[] = [
  {
    id: 1,
    name:
      'oke-c3tmzbqgmzd-n3wiolfmuzt-s5cclcvxucq-1.sub06030309400.oke.oraclevcn.com',
    node_ip: '10.0.0.17',
    status: {
      allocatable: {
        cpu: '4',
        memory: '29.08'
      },
      capacity: {
        cpu: '4',
        memory: '29.18'
      }
    },
    conditions: {
      type: 'Ready'
    }
  },
  {
    id: 2,
    name:
      'oke-c3tmzbqgmzd-n3wiolfmuzt-s5cclcvxucq-3.sub06030309400.oke.oraclevcn.com',
    node_ip: '10.0.0.18',
    status: {
      allocatable: {
        cpu: '4',
        memory: '29.08'
      },
      capacity: {
        cpu: '4',
        memory: '29.18'
      }
    },
    conditions: {
      type: 'Ready'
    }
  },
  {
    id: 3,
    name:
      'oke-c3tmzbqgmzd-n3wiolfmuzt-s5cclcvxucq-0.sub06030309400.oke.oraclevcn.com',
    node_ip: '10.0.0.19',
    status: {
      allocatable: {
        cpu: '4',
        memory: '29.08'
      },
      capacity: {
        cpu: '4',
        memory: '29.18'
      }
    },
    conditions: {
      type: 'Ready'
    }
  },
  {
    id: 4,
    name:
      'oke-c3tmzbqgmzd-n3wiolfmuzt-s5cclcvxucq-2.sub06030309400.oke.oraclevcn.com',
    node_ip: '10.0.0.20',
    status: {
      allocatable: {
        cpu: '4',
        memory: '29.08'
      },
      capacity: {
        cpu: '4',
        memory: '29.18'
      }
    },
    conditions: {
      type: 'Ready'
    }
  }
]

function NodeList() {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Node List</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2}>Node</Title>
      <Row gutter={16}>
        <Col span={4}>
          <StatusBox>
            <p className="title">Disk Pressure</p>
            <p className="number">0</p>
          </StatusBox>
        </Col>
        <Col span={4}>
          <StatusBox>
            <p className="title">Memory Pressure</p>
            <p className="number">0</p>
          </StatusBox>
        </Col>
        <Col span={4}>
          <StatusBox>
            <p className="title">PID Pressure</p>
            <p className="number">0</p>
          </StatusBox>
        </Col>
        <Col span={4}>
          <StatusBox>
            <p className="title">Unschedulable</p>
            <p className="number">0</p>
          </StatusBox>
        </Col>
        <Col span={4}>
          <StatusBox color="#FB8C00">
            <p className="title">Out of Disk</p>
            <p className="number">0</p>
          </StatusBox>
        </Col>
        <Col span={4}>
          <StatusBox color="#9b59b6">
            <p className="title">Network Unavilable</p>
            <p className="number">0</p>
          </StatusBox>
        </Col>
      </Row>
      <TableContainer
        key="id"
        title={'Node List'}
        columns={columns}
        data={data}
      />
    </>
  )
}

export default NodeList
