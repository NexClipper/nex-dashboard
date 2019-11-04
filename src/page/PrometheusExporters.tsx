import React from 'react'
import { List, Card, Breadcrumb } from 'antd'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import TitleContainer from '../components/TitleContainer'

const ListBox = styled.div`
  .ant-list .ant-card-body {
    height: 180px;
  }
`

const CoverImageContainr = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 120px !important;
  img {
    display: inline-block;
    max-width: 120px;
    max-height: 120px;
    padding: 16px;
  }
`

interface Idata {
  title: string
  description: string
  link: string
  image_lik?: string
}

const data: Idata[] = [
  {
    title: 'Container Info',
    description: 'Export Consul service health to Prometheus.',
    link: 'https://github.com/prometheus/consul_exporter'
  },
  {
    title: 'Memcached exporter',
    description:
      'The memcached exporter exports metrics from a memcached server for consumption by prometheus.',
    link: 'https://github.com/prometheus/memcached_exporter',
    image_lik: 'PrometheusExportersLogos/Memcached.svg'
  },
  {
    title: 'MySQL server exporter',
    description:
      'Prometheus exporter for MySQL server metrics. Supported MySQL & MariaDB versions: 5.5 and up.',
    link: 'https://github.com/prometheus/mysqld_exporter',
    image_lik: 'PrometheusExportersLogos/MySQL.svg'
  },
  {
    title: 'Node/system metrics exporter',
    description:
      'Prometheus exporter for hardware and OS metrics exposed by *NIX kernels, written in Go with pluggable metric collectors.',
    link: 'https://github.com/prometheus/node_exporter'
  },
  {
    title: 'HAProxy exporter',
    description:
      'This is a simple server that scrapes HAProxy stats and exports them via HTTP for Prometheus consumption.',
    link: 'https://github.com/prometheus/haproxy_exporter'
  },
  {
    title: 'AWS CloudWatch exporter',
    description: 'An exporter for Amazon CloudWatch, for Prometheus.',
    link: 'https://github.com/prometheus/cloudwatch_exporter'
  },
  {
    title: 'Collectd exporter',
    description: `An exporter for collectd. It accepts collectd's binary network protocol as sent by collectd's network plugin and metrics in JSON format via HTTP POST as sent by collectd's write_http plugin, and transforms and exposes them for consumption by Prometheus.`,
    link: 'https://github.com/prometheus/collectd_exporter',
    image_lik: 'PrometheusExportersLogos/Collectd.svg'
  },
  {
    title: 'Graphite exporter',
    description:
      'An exporter for metrics exported in the Graphite plaintext protocol. It accepts data over both TCP and UDP, and transforms and exposes them for consumption by Prometheus.',
    link: 'https://github.com/prometheus/graphite_exporter'
  },
  {
    title: 'InfluxDB exporter',
    description:
      'An exporter for metrics in the InfluxDB format used since 0.9.0. It collects metrics in the line protocol via a HTTP API, transforms them and exposes them for consumption by Prometheus.',
    link: 'https://github.com/prometheus/influxdb_exporter'
  },
  {
    title: 'JMX exporter',
    description:
      'JMX to Prometheus exporter: a collector that can configurably scrape and expose mBeans of a JMX target.',
    link: 'https://github.com/prometheus/jmx_exporter'
  },
  {
    title: 'SNMP exporter',
    description:
      'This is an exporter that exposes information gathered from SNMP for use by the Prometheus monitoring system.',
    link: 'https://github.com/prometheus/snmp_exporter'
  },
  {
    title: 'StatsD exporter',
    description:
      'statsd_exporter receives StatsD-style metrics and exports them as Prometheus metrics.',
    link: 'https://github.com/prometheus/statsd_exporter'
  },
  {
    title: 'Blackbox exporter',
    description:
      'The blackbox exporter allows blackbox probing of endpoints over HTTP, HTTPS, DNS, TCP and ICMP.',
    link: 'https://github.com/prometheus/blackbox_exporter'
  }
]

const PrometheusExporters = () => {
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Prometheus Exporters</Breadcrumb.Item>
      </Breadcrumb>
      <TitleContainer level={2} text={'Prometheus Exporters'} />
      <ListBox>
        <List
          grid={{ gutter: 8, column: 4 }}
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <a href={item.link} target="blank" title={item.title}>
                <Card
                  hoverable
                  cover={
                    <CoverImageContainr>
                      <img
                        src={
                          item.image_lik
                            ? item.image_lik
                            : 'PrometheusExportersLogos/Prometheus.svg'
                        }
                        alt={item.title}
                      />
                    </CoverImageContainr>
                  }
                >
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                </Card>
              </a>
            </List.Item>
          )}
        />
      </ListBox>
    </>
  )
}

export default PrometheusExporters
