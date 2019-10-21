import { logger } from '../utils/logger'
import api from './api'

export const getNodes = async () => {
  try {
    const action = '/nodes'
    const result = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}

