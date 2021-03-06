import { logger } from '../utils/logger'
import api from './api'
import { AxiosResponse } from 'axios'

export interface IsnapshotNodeData {
  node: Node
  node_id: number
  ts: Date
  value: number
  metric_name: string
  metric_label: string
}
export interface IsnapshotNodeObjectData {
  [key: string]: IsnapshotNodeData[]
}
interface IgetSnapshotNode {
  data: IsnapshotNodeObjectData
  message: string
  status: string
}

export interface IsnapshotNodeProcessData {
  process: string
  process_id: number
  ts: Date
  value: number
  metric_name: string
  metric_label: string
}
export interface IsnapshotNodeProcessObjectData {
  [key: string]: IsnapshotNodeProcessData[]
}
interface IgetSnapshotNodeProcess {
  data: IsnapshotNodeProcessObjectData
  message: string
  status: string
}

export interface IsnapshotNodeContainerData {
  container: string
  container_id: number
  ts: Date
  value: number
  metric_name: string
  metric_label: string
}
export interface IsnapshotNodeContainerObjectData {
  [key: string]: IsnapshotNodeContainerData[]
}
interface IgetSnapshotNodeContainer {
  data: IsnapshotNodeContainerObjectData
  message: string
  status: string
}

interface ImetricsPodsData {
  pod: string
  namespace: string
  ts: Date
  value: number
  metric_name: string
}

export interface ImetricsPodsObjectData {
  [key: string]: ImetricsPodsData[]
}

interface IgetMetricsPods {
  data: ImetricsPodsObjectData
  message: string
  status: string
}

export const getSnapshotNodes = async (clusterId: number) => {
  try {
    const action = `/snapshot/${clusterId}/nodes`
    const result: AxiosResponse<IgetSnapshotNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNode = async (clusterId: number, nodeId: number) => {
  try {
    const action = `/snapshot/${clusterId}/nodes/${nodeId}`
    const result: AxiosResponse<IgetSnapshotNode> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNodeProcesses = async (
  clusterId: number,
  nodeId: number
) => {
  try {
    const action = `/snapshot/${clusterId}/nodes/${nodeId}/processes`
    const result: AxiosResponse<IgetSnapshotNodeProcess> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNodeProcess = async (
  clusterId: number,
  nodeId: number,
  processId: number
) => {
  try {
    const action = `/snapshot/${clusterId}/nodes/${nodeId}/processes/${processId}`
    const result: AxiosResponse<IgetSnapshotNodeProcess> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNodeContainers = async (
  clusterId: number,
  nodeId: number
) => {
  try {
    const action = `/snapshot/${clusterId}/nodes/${nodeId}/containers`
    const result: AxiosResponse<IgetSnapshotNodeContainer> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNodeContainer = async (
  clusterId: number,
  nodeId: number,
  containersId: number
) => {
  try {
    const action = `/snapshot/${clusterId}/nodes/${nodeId}/containers/${containersId}`
    const result: AxiosResponse<IgetSnapshotNodeContainer> = await api.getData(
      action
    )

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotPods = async (clusterId: number) => {
  try {
    const action = `/snapshot/${clusterId}}/k8s/pods`
    const result: AxiosResponse<IgetMetricsPods> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNamespacesPods = async (
  clusterId: number,
  namespaceId: number
) => {
  try {
    const action = `/snapshot/${clusterId}}/k8s/namespaces/${namespaceId}/pods`
    const result: AxiosResponse<IgetMetricsPods> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNamespacesPod = async (
  clusterId: number,
  namespaceId: number,
  podId: number
) => {
  try {
    const action = `/snapshot/${clusterId}}/k8s/namespaces/${namespaceId}/pods/${podId}`
    const result: AxiosResponse<IgetMetricsPods> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
