import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import Home from '../page/Home'
import ClusterList from '../page/ClusterList'
import ClusterDetail from '../page/ClusterDetail'
import NodeList from '../page/NodeList'
import PrometheusExporters from '../page/PrometheusExporters'
import NodeDetail from '../page/NodeDetail'
import ContainerDetail from '../page/ContainerDetail'
import ProcessDetail from '../page/ProcessDetail'
import Events from '../page/Events'
import CommonLayout from '../components/CommonLayout'

const Router = () => {
  return (
    <CommonLayout>
      <Route exact path="/" component={Home} />
      <Route exact path="/clusters" component={ClusterList} />
      <Route exact path="/clusters/:clusterId" component={ClusterDetail} />
      <Route exact path="/nodes" component={NodeList} />
      <Route exact path="/nodes/:nodeId" component={NodeDetail} />
      <Route
        exact
        path="/nodes/:nodeId/container/:containerId"
        component={ContainerDetail}
      />
      <Route
        exact
        path="/nodes/:nodeId/process/:processId"
        component={ProcessDetail}
      />
      <Route path="/prometheusExporters" component={PrometheusExporters} />
      <Route path="/events" component={Events} />
      {/* <Redirect from="*" to="/" /> */}
    </CommonLayout>
  )
}

export default Router
