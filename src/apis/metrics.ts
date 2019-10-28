import { logger } from '../utils/logger'
import api from './api'

export const getMetricsNodes = async (clusterId: number) => {
  try {
    const action = `/metrics/${clusterId}/nodes`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getMetricsNode = async (clusterId: number, nodeId: number) => {
  try {
    const action = `/metrics/${clusterId}/nodes/${nodeId}`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
