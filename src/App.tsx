import React from 'react'
import Router from './routes/Router'
import GlobalStyles from './components/GlobalStyles'

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Router />
    </>
  )
}

export default App
