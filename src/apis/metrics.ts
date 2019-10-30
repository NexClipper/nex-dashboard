import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

interface ImetricsNodeData {
  node: Node
  node_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}
export interface ImetricsNodeObjectData {
  [key: string]: ImetricsNodeData[]
}
interface IgetMetricsNode {
  data: ImetricsNodeObjectData
  message: string
  status: string
}

interface ImetricsNodeProcessData {
  node: Node
  node_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}
export interface ImetricsNodeProcessObjectData {
  [key: string]: ImetricsNodeProcessData[]
}
interface IgetMetricsNodeProcess {
  data: ImetricsNodeProcessObjectData
  message: string
  status: string
}

interface ImetricsNodeContainerData {
  container: Node
  container_id: number
  value: number
  bucket: Date
  metric_name: string
  metric_label: string
}
export interface ImetricsNodeContainerObjectData {
  [key: string]: ImetricsNodeContainerData[]
}
interface IgetMetricsNodeContainer {
  data: ImetricsNodeContainerObjectData
  message: string
  status: string
}

export const getMetricsNodes = async (clusterId: number) => {
  try {
    const action = `/metrics/${clusterId}/nodes`
    const result: AxiosResponse<IgetMetricsNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNode = async (clusterId: number, nodeId: number) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}`
    const result: AxiosResponse<IgetMetricsNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNodeProcesses = async (
  clusterId: number,
  nodeId: number
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/processes`
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
  processId: number
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/processes/${processId}`
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
  nodeId: number
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/containers`
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
  containersId: number
) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}/containers/${containersId}`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
