import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

export interface ImetricsNodeData {
  node: Node
  node_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}

interface IgetMetricsNode {
  data: ImetricsNodeData[]
  message: string
  status: string
}

export interface ImetricsNodeProcessData {
  process: Node
  process_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}

interface IgetMetricsNodeProcess {
  data: ImetricsNodeProcessData[]
  message: string
  status: string
}

export interface ImetricsNodeContainerData {
  container: Node
  container_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}

interface IgetMetricsNodeContainer {
  data: ImetricsNodeContainerData[]
  message: string
  status: string
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
    const result = await api.getData(action)

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
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
