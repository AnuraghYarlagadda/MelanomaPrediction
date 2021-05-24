import React from 'react'
import Main from './Main'

const App = () => (
  <div
    style={{
      backgroundImage: 'url(/background.jpg)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
    }}
  >
    <Main />
  </div>
)

export default App
