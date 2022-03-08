import React from "react";
import {NavLink, Link, withRouter, Route, Switch} from 'react-router-dom';
import Downtime from './Downtime';
import History from './History';
import Profile from './Profile';
import Uptime from './Uptime';
import Average from './Average';
import { Redirect } from "react-router-dom";

 class Home extends React.Component {
   constructor(props) {
     super(props);
     this.toggleDisplay = this.toggleDisplay.bind(this);
     this.state = {
       display : this.props.location.pathname.length > 1 ? 'none' : ''
     }
   }
   toggleDisplay(e) {
    this.setState(prevState => {
      prevState.display = this.state.display === '' ? 'none' : '';
      return {display : prevState.display}
    })
   }
  render() {
    return (
      <div className="menu">
        <div className="message text-white rounded">
          TCN Tool to query equipment parameters and state
        </div>
        <div className="menu-list" style={{display: `${this.state.display}`}}>
          <ul className="ul-menu text-center">
            <li>
              <Link to={'/downtime'} onClick={this.toggleDisplay} type="button">Downtime</Link>
            </li>
            <li>
              <Link to={'/uptime'} onClick={this.toggleDisplay} type="button">Uptime</Link>
            </li>
            <li>
              <Link to={'/history'} onClick={this.toggleDisplay} type="button">History</Link>
            </li>
            <li>
              <Link to={'/profile'} onClick={this.toggleDisplay} type="button">Profile</Link>
            </li>
            <li>
              <Link to={'/average'} onClick={this.toggleDisplay} type="button">Average</Link>
            </li>
          </ul>
        </div>
        <Switch>
          <Route path={`/downtime`}> <Downtime /> </Route>
          <Route path={`/uptime`}> <Uptime /> </Route>
          <Route path={`/history`}> <History /> </Route>
          <Route path={`/profile`}> <Profile /> </Route>
          <Route path={`/average`}> <Average /> </Route>
        </Switch>
        
      </div>
    )         
  }
}

export default withRouter(Home);
