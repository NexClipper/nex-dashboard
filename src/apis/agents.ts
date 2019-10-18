import { logger } from '../utils/logger'
import api from './api'

export const getAgents = async () => {
  try {
    const action = '/agents'
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
