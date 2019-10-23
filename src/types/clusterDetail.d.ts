interface IclusterUsageData {
  resource: string
  total: number
  usage: number
  usagePercent: number
}

interface InamespacesData {
  name: string
  phase: string
  creationTimestamp: string
}

interface IdaemonSetsData {
  name: string
  namespace: string
  numberUnavailable: number
  numberReady: number
  numberAvailable: number
  creationTimestamp: string
}

interface IdeploymentsData {
  name: string
  namespace: string
  availableReplicas: number
  replicas: number
  creationTimestamp: string
}
