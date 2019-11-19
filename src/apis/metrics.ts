import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

export interface ImetricsNodeData {
  node: string
  node_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}

interface IgetMetricsNode {
  count: number
  db_query_time: string
  data: ImetricsNodeData[]
  message: string
  status: string
}

export interface ImetricsNodeProcessData {
  process: string
  process_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}

interface IgetMetricsNodeProcess {
  count: number
  data: ImetricsNodeProcessData[]
  db_query_time: string
  message: string
  status: string
}

export interface ImetricsNodeContainerData {
  container: string
  container_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}

interface IgetMetricsNodeContainer {
  count: number
  data: ImetricsNodeContainerData[]
  db_query_time: string
  message: string
  status: string
}

export interface ImetricsPodsData {
  pod: string
  namespace: string
  value: number
  bucket: Date
  metric_name: string
}

interface IgetMetricsPods {
  count: number
  data: ImetricsPodsData[]
  db_query_time: string
  message: string
  status: string
}

export const getMetricsSummary = async (clusterId: number, query: string) => {
  try {
    const action = `/metrics/${clusterId}/summary?${query}`
    const result: AxiosResponse<IgetMetricsNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNodes = async (clusterId: number, query: string) => {
  try {
    const action = `/metrics/${clusterId}/nodes?${query}`
    const result: AxiosResponse<IgetMetricsNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNode = async (
  clusterId: number,
  nodeId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}?${query}`
    const result: AxiosResponse<IgetMetricsNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNodeProcesses = async (
  clusterId: number,
  nodeId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/processes?${query}`
    const result: AxiosResponse<IgetMetricsNodeProcess> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNodeProcess = async (
  clusterId: number,
  nodeId: number,
  processId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/processes/${processId}?${query}`
    const result: AxiosResponse<IgetMetricsNodeProcess> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNodeContainers = async (
  clusterId: number,
  nodeId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/containers?${query}`
    const result: AxiosResponse<IgetMetricsNodeContainer> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNodeContainer = async (
  clusterId: number,
  nodeId: number,
  containersId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/containers/${containersId}?${query}`
    const result: AxiosResponse<IgetMetricsNodeContainer> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsPods = async (clusterId: number, query: string) => {
  try {
    const action = `/metrics/${clusterId}/k8s/pods?${query}`
    const result: AxiosResponse<IgetMetricsPods> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNamespacesPods = async (
  clusterId: number,
  namespaceId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/k8s/namespaces/${namespaceId}/pods?${query}`
    const result: AxiosResponse<IgetMetricsPods> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNamespacesPod = async (
  clusterId: number,
  namespaceId: number,
  podId: number,
  query: string
) => {
  try {
    const action = `/metrics/${clusterId}/k8s/namespaces/${namespaceId}/pods/${podId}?${query}`
    const result: AxiosResponse<IgetMetricsPods> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
