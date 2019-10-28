import { logger } from '../utils/logger'
import api from './api'

export const getSnapshotNodes = async (clusterId: number) => {
  try {
    const action = `/snapshot/${clusterId}/nodes`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

export const getSnapshotNode = async (clusterId: number, nodeId: number) => {
  try {
    const action = `/snapshot/${clusterId}/nodes/${nodeId}`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
