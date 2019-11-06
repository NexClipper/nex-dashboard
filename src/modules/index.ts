import { combineReducers } from 'redux'
import theme from './theme'
import cluster from './cluster'

const rootReducer = combineReducers({
  theme,
  cluster
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>
