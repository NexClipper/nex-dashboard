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

export const getClusterAgentsById = async (id: number) => {
  try {
    const action = `/clusters/${id}/agents/`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    throw error
  }
}

export const getClusterNodesById = async (id: number) => {
  try {
    const action = `/clusters/${id}/nodes/`
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    throw error
  }
}
