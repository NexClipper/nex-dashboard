import { combineReducers } from 'redux'
import cluster from './cluster'
import theme from './theme'
import { all } from 'redux-saga/effects'

const rootReducer = combineReducers({
  cluster,
  theme
})

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([])
}
