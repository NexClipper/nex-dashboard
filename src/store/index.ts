import { createStore } from 'redux'
import rootReducer from '../reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension'

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  const store =
    process.env.NODE_ENV === 'development'
      ? createStore(persistedReducer, composeWithDevTools())
      : createStore(persistedReducer)
  const persistor = persistStore(store)
  return { store, persistor }
}
