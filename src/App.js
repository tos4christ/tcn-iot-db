import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import './components/css/Header.css';
import './components/css/table.css';
import Home from './components/Home';
import Header from './components/Header';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: ''
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Home />
        </div>
      </Router>      
    )    
  };
}

export default App;
