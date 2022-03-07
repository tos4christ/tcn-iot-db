import React from "react";
import {NavLink, Link, withRouter, Route, Switch} from 'react-router-dom';
import Downtime from './Downtime';
import History from './History';
import Profile from './Profile';
import Uptime from './Uptime';

 class Home extends React.Component {
  render() {
    return (
      <div className="menu">
        <div className="message text-white rounded">
          TCN Tool to query equipment parameters and state
        </div>
        <div>
          <ul className="ul-menu text-center">
            <li>
              <Link to={'/downtime'} type="button">Downtime</Link>
            </li>
            <li>
              <Link to={'/uptime'} type="button">Uptime</Link>
            </li>
            <li>
              <Link to={'/history'} type="button">History</Link>
            </li>
            <li>
              <Link to={'/profile'} type="button">Profile</Link>
            </li>
            <li>
              <Link to={'/average'} type="button">Average</Link>
            </li>
          </ul>
        </div>
        <Switch>
          <Route path={'/uptime'}></Route>
          <Route></Route>
          <Route></Route>
          <Route></Route>
          <Route></Route>
        </Switch>
        
      </div>
    )         
  }
}

export default Home
