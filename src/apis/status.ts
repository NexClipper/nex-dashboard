import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

export interface IgetStatusData {
  metricsPerSeconds: string
  uptime: string
}

interface IgetStatus {
  data: IgetStatusData
  message: string
  status: string
}

export const getStatus = async () => {
  try {
    const action = '/status'
    const result: AxiosResponse<IgetStatus> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
