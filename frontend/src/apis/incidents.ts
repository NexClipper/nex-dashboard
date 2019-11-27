import { AxiosResponse } from 'axios'

import { logger } from '../utils/logger'
import api from './api'

export interface IcidentsBasicData {
  ClusterId: number
  NodeId: number
  ProcessId: number
  ContainerId: number
  PodId: number
  TargetType: string
  Target: string
  Value: number
  Condition: number
  EventName: string
  ReportedTs: Date
  DetectedTs: Date
}

interface IgetIncidentsBasic {
  data: IcidentsBasicData[]
  message: string
  status: string
}

export const getIncidentsBasic = async () => {
  try {
    const action = '/incidents/basic'
    const result: AxiosResponse<IgetIncidentsBasic> = await api.getData(action)

    return result.data
  } catch (error) {
    logger('error.response', error)
    throw error
  }
}
