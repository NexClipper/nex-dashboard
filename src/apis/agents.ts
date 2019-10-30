import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

interface IagentsData {
  id: number
  version: string
  ip: string
  online: boolean
}
export interface IagentsObjectData {
  [key: string]: IagentsData[]
}
interface IgetAgents {
  data: IagentsObjectData
  message: string
  status: string
}

export const getAgents = async () => {
  try {
    const action = '/agents'
    const result: AxiosResponse<IgetAgents> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
