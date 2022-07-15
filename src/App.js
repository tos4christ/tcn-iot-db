import React from 'react';
import { BrowserRouter as Router, Link, Switch } from 'react-router-dom';
import './App.css';
import './components/css/Header.css';
import './components/css/table.css';
import Home from './components/Home';
import Header from './components/Header';
import SignUp from '../src/components/Users/SignUp';
import SignIn from '../src/components/Users/SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  setUserDetails() {

  }
  render() {
    return (
      <Router>
        <Switch >
          <Route path={'/'}>
            <SignIn setUser={this.setUserDetails} />
          </Route>
          <Route path={'/signin'}>
            <SignIn setUser={this.setUserDetails} />
          </Route>
          <Route path={'/signup'}>
            <SignUp />
          </Route>          
          {/* This is the protected path after successful login */}
          <Route path={'/home'}>
            <div className="App">
              <Header />
              <Home />
            </div>
          </Route>
        </Switch>
      </Router>      
    )    
  };
}

export default App;
