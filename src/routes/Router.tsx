import React, { useState } from 'react'
import { Route, Switch, BrowserRouter, Redirect, Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import styled from 'styled-components'
import Home from '../page/Home'
import ClusterList from '../page/ClusterList'
import ClusterDetail from '../page/ClusterDetail'
import NodeList from '../page/NodeList'
import PrometheusExporters from '../page/PrometheusExporters'
import NodeDetail from '../page/NodeDetail'

const { Content, Footer, Sider } = Layout
const { SubMenu } = Menu

const FullLayout = styled.div`
  > .ant-layout {
    min-height: 100vh;
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

const SubMenuText = styled(Link)`
  color: #fff;
`

function Router() {
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const onCollapse = (value: boolean) => setCollapsed(value)
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
            <Menu theme="dark">
              <Menu.Item key="1">
                <Link to="/cluster">
                  <Icon type="hdd" />
                  <span>Cluster</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/node">
                  <Icon type="deployment-unit" />
                  <span>Node</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/prometheusExporters">
                  <Icon type="export" />
                  <span>Prometheus Exporters</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <MainContent>
              <Switch>
                <RouteList />
              </Switch>
            </MainContent>
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
      <Route exact path="/cluster" component={ClusterList} />
      <Route path="/cluster/:clusterId" component={ClusterDetail} />
      <Route exact path="/node" component={NodeList} />
      <Route path="/node/:nodeId" component={NodeDetail} />
      <Route path="/prometheusExporters" component={PrometheusExporters} />
      {/* <Redirect from="*" to="/" /> */}
    </>
  )
}

export default Router
