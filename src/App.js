import React, { Component } from 'react'
import './App.css'
import GraphEditor from './container/GraphEditor'

class App extends Component {
  render() {
    return (
      <div className="App">
        <GraphEditor/>        
      </div>
    );
  }
}

export default App;
