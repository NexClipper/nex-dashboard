import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

export interface IclustersData {
  id: number
  name: string
  kubernetes: boolean
}

interface IgetClusters {
  data: IclustersData[]
  message: string
  status: string
}

export interface IclusterNodesData {
  id: number
  host: string
  ip: string
  os: string
  platform: string
  platform_family: string
  platform_version: string
  agent_id: number
}

interface IgetClusterNodes {
  data: IclusterNodesData[]
  message: string
  status: string
}

export interface IclusterAgentsData {
  id: number
  version: string
  ip: string
  online: boolean
}

interface IgetClusterAgents {
  data: IclusterAgentsData[]
  message: string
  status: string
}

export const getClusters = async () => {
  try {
    const action = '/clusters'
    const result: AxiosResponse<IgetClusters> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getClusterNodes = async (clusterId: number) => {
  try {
    const action = `/clusters/${clusterId}/nodes`
    const result: AxiosResponse<IgetClusterNodes> = await api.getData(action)

    return { data: result }
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getClusterAgents = async (clusterId: number) => {
  try {
    const action = `/clusters/${clusterId}/agents`
    const result: AxiosResponse<IgetClusterAgents> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
