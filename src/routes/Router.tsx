import React, { useState } from 'react'
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import styled from 'styled-components'
import Home from '../page/Home'

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

const Router: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const onCollapse = (value: boolean) => setCollapsed(value)
  return (
    <BrowserRouter>
      <FullLayout>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Logo>
              {collapsed ? (
                <img src="/cropped-logo4_정사각형-270x270.png" alt="logo" />
              ) : (
                <img src="/logo1_blackwall2.png" alt="logo" />
              )}
            </Logo>
            <Menu theme="dark"></Menu>
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
      <Redirect from="*" to="/" />
    </>
  )
}

export default Router
