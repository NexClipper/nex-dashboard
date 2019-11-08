const SET_CLUSTER = 'cluster/SET_CLUSTER' as const

export const setCluster = (id: number, name: string) => ({
  type: SET_CLUSTER,
  payload: {
    id,
    name
  }
})

type ClusterAction = ReturnType<typeof setCluster>

export type ClusterState = {
  id: number
  name: string
}

const initialState: ClusterState = {
  id: 1,
  name: ''
}

const cluster = (
  state: ClusterState = initialState,
  action: ClusterAction
): ClusterState => {
  switch (action.type) {
    case SET_CLUSTER:
      return { ...action.payload }
    default:
      return state
  }
}

export default cluster
