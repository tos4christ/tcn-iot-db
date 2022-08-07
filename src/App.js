import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';
import './components/css/Header.css';
import './components/css/table.css';
import './components/css/style.css';
import './components/css/login.css';
//import "./components/css/bootstrap.min.css";
import "./components/css/icofont.css";
import "./components/css/font-awesome.min.css";
import "./components/css/responsive.css";
import Home from './components/Home';
import Header from './components/Header';
import SignUp from '../src/components/Users/SignUp';
import SignIn from '../src/components/Users/SignIn';

class App extends React.Component {
  setUserDetails() {

  }
  render() {
    return (
      <Router>
        <Switch >          
          <Route path={'/signin'}>
            <Header />
            <SignIn setUser={this.setUserDetails} />
          </Route>
          <Route exact path={'/signup'}>
            <Header />
            <SignUp />
          </Route>          
          {/* This is the protected path after successful login */}
          <Route path={'/home'}>
            <div className="App">
              <Header />
              <Home />
            </div>
          </Route>
          <Route path={'/'}>
            <Header />
            <SignIn setUser={this.setUserDetails} />
          </Route>
        </Switch>
      </Router>      
    )    
  };
}

export default App;
