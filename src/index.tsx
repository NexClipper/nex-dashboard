import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, applyMiddleware } from 'redux'
import rootReducer, { rootSaga } from './modules'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const sagaMiddleware = createSagaMiddleware()

const configureStore = () => {
  const store =
    process.env.NODE_ENV === 'development'
      ? createStore(
          persistedReducer,
          composeWithDevTools(applyMiddleware(sagaMiddleware))
        )
      : createStore(persistedReducer, applyMiddleware(sagaMiddleware))
  const persistor = persistStore(store)
  return { store, persistor }
}

const { store, persistor } = configureStore()

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
