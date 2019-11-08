import React, { useState, useEffect, useCallback } from 'react'
import { Route, Switch, BrowserRouter, Redirect, Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import styled from 'styled-components'
import Home from '../page/Home'
import ClusterList from '../page/ClusterList'
import ClusterDetail from '../page/ClusterDetail'
import NodeList from '../page/NodeList'
import PrometheusExporters from '../page/PrometheusExporters'
import NodeDetail from '../page/NodeDetail'
import ThemeToggle from '../components/ThemeToggle'
import Events from '../page/Events'
import { getStatus } from '../apis/status'
import useInterval from '../utils/useInterval'

const { Content, Footer, Sider } = Layout
const { SubMenu } = Menu

interface MainFooterProps {
  readonly collapse: boolean
}

const FullLayout = styled.div`
  > .ant-layout {
    min-height: 100vh !important;
  }
`
const Logo = styled.div`
  padding: 16px;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`

const MainContent = styled(Content)`
  padding: 32px 16px 16px;
`

const MainFooter = styled(Footer)<MainFooterProps>`
  position: fixed;
  z-index: 10;
  width: 100%;
  bottom: 0;
  left: ${props => (props.collapse ? '80px' : '200px')};
  right: 0;
  transition: left 0.15s ease-in-out;
`

const SubMenuText = styled(Link)`
  color: #fff;
`

interface Iparams {
  clusterId: string | undefined
}

const Router = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [error, setError] = useState(null)
  const [metricsPerSeconds, setMetricsPerSeconds] = useState('')
  const [uptime, setUptime] = useState('')

  const onCollapse = (value: boolean) => setCollapsed(value)

  const fetchData = useCallback(async () => {
    try {
      const { data: statusResponse } = await getStatus()
      setMetricsPerSeconds(statusResponse.metricsPerSeconds)
      setUptime(statusResponse.uptime)
    } catch (error) {
      setError(error)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  useInterval(() => (!error ? fetchData() : null), 3000)
  return (
    <BrowserRouter>
      <FullLayout>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Logo>
              <Link to="/">
                {collapsed ? (
                  <img src="/cropped-logo4-270x270.png" alt="logo" />
                ) : (
                  <img src="/logo1_blackwall2.png" alt="logo" />
                )}
              </Link>
            </Logo>
            <Menu>
              <Menu.Item key="1">
                <Link to="/clusters">
                  <Icon type="hdd" />
                  <span>Cluster</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/nodes">
                  <Icon type="appstore" />
                  <span>Nodes</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/events">
                  <Icon type="alert" />
                  <span>Events</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Link to="/prometheusExporters">
                  <Icon type="export" />
                  <span>Prometheus Exporters</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <MainContent>
              <ThemeToggle />
              <Switch>
                <RouteList />
              </Switch>
            </MainContent>
            <MainFooter collapse={collapsed}>
              MetricsPerSeconds : {metricsPerSeconds}&nbsp;&nbsp;Uptime :
              {uptime}
            </MainFooter>
          </Layout>
        </Layout>
      </FullLayout>
    </BrowserRouter>
  )
}

const RouteList = () => {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path="/clusters" component={ClusterList} />
      <Route exact path="/clusters/:clusterId" component={ClusterDetail} />
      <Route exact path="/nodes" component={NodeList} />
      <Route exact path="/nodes/:nodeId" component={NodeDetail} />
      <Route path="/prometheusExporters" component={PrometheusExporters} />
      <Route path="/events" component={Events} />
      {/* <Redirect from="*" to="/" /> */}
    </>
  )
}

export default Router
