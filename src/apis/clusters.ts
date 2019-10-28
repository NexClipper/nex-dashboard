import { logger } from '../utils/logger'
import api from './api'

export const getClusters = async () => {
  try {
    const action = '/clusters'
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getClusterNodes = async (clusterId: number) => {
  try {
    const action = `/clusters/${clusterId}/nodes`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getClusterAgents = async (clusterId: number) => {
  try {
    const action = `/clusters/${clusterId}/agents`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
