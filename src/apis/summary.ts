import { logger } from '../utils/logger'
import api from './api'
import { AxiosResponse } from 'axios'

interface IsummaryClustersData {
  node_cpu_idle: number
  node_cpu_iowait: number
  node_cpu_load_avg_1: number
  node_cpu_load_avg_15: number
  node_cpu_load_avg_5: number
  node_cpu_system: number
  node_cpu_user: number
  node_memory_available: number
  node_memory_buffers: number
  node_memory_cached: number
  node_memory_free: number
  node_memory_total: number
  node_memory_used: number
  node_memory_used_percent: number
}
export interface IsummaryClustersObjectData {
  [key: string]: IsummaryClustersData[]
}
interface IgetSummaryClusters {
  data: IsummaryClustersObjectData
  message: string
  status: string
}

export const getSummaryClusters = async () => {
  try {
    const action = '/summary/clusters'
    const result: AxiosResponse<IgetSummaryClusters> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
export const getSummaryCluster = async (clusterId: number) => {
  try {
    const action = `/summary/clusters/${clusterId}`
    const result: AxiosResponse<IgetSummaryClusters> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSummaryClusterNodes = async (clusterId: number) => {
  try {
    const action = `/summary/clusters/${clusterId}/nodes`
    const result: AxiosResponse<IgetSummaryClusters> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
