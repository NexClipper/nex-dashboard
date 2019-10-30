import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

interface InodesData {
  id: number
  host: string
  ip: string
  os: string
  platform: string
  platform_family: string
  platform_version: string
  agent_id: number
}
export interface InodesObjectData {
  [key: string]: InodesData[]
}
interface IgetNodes {
  data: InodesObjectData
  message: string
  status: string
}
export const getNodes = async () => {
  try {
    const action = '/nodes'
    const result: AxiosResponse<IgetNodes> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
