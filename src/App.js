import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import './App.css'
import GraphEditor from './container/GraphEditor'
import configureStore from './redux/configureStore'

const { store, persistor } = configureStore()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<span>Loading...</span>} persistor={persistor}>
          <div className="App">
            <GraphEditor />
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
