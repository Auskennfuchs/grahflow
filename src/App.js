import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import configureStore from './redux/configureStore'
import MainContent from './container/MainContent'

const { store, persistor } = configureStore()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<span>Loading...</span>} persistor={persistor}>
          <MainContent/>          
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
