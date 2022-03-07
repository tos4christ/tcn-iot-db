import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './components/css/Header.css';
import Downtime from './components/Downtime';
import Header from './components/Header';

class App extends React.Component {
  render() {

    return (
      <Router>
        <div className="App">
          <Header />
          <Downtime />
        </div>
      </Router>      
    )
    
  };
}

export default App;
