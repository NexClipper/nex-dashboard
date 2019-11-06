import {
  createStandardAction,
  ActionType,
  createReducer
} from 'typesafe-actions'

const SET_CLUSTER = 'cluster/SET_CLUSTER'

export const setCluster = createStandardAction(SET_CLUSTER)<number>()

const actions = { setCluster }
type ClusterAction = ActionType<typeof actions>

type ClusterState = {
  id: number
}

const initialState: ClusterState = {
  id: 1
}

const cluster = createReducer<ClusterState, ClusterAction>(initialState, {
  [SET_CLUSTER]: (_, { payload: id }) => ({ id })
})

export default cluster
