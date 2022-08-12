import React from 'react';
import {NavLink, Link, withRouter, Redirect} from 'react-router-dom';
import ls from 'local-storage';
import logo from './img/tcnLogo.png';
import login from './img/login.svg';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    }
  }
  handleChange = (event, newValue) => {
    this.setState({value: newValue});
  };
  render() {
    let route, heading;
    const location = this.props.location.pathname;
    if(location === '/' || location === '/api/v1/auth/signin' || location === '/signout' || !ls.get('token')) {
      route = '/api/v1/auth/signin';
      heading = 'Sign In';
    } else {
      route = '/signout';
      heading = 'Sign Out';
    }
    const { value } = this.state; 
    return (      
        <nav className='navbar navbar-expand-md navbar-inverse'>
            <div className='container-fluid'>
                <div className='navbar-header'>
                    <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link to='/' className='navbar-brand'>
                        <img className='homelogo' src={logo} alt="site logo"/>
                    </Link>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                    <ul className="nav nav-pills justify-content-end navbar-nav ul-links">
                        <li className='nav-item'>

                        </li>
                        <li className='nav-item'> 
                            <NavLink className='nav-link text-white p-4' to='/'>Developer </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link text-white p-4' to='/'>Products </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link text-white p-4' to='/'>Tour    </NavLink>
                        </li>
                        <li className='nav-item'>

                        </li>
                        <li className='nav-item login-text'>
                            <NavLink to='/api/v1/'>
                                <span className=' text-dark p-4'>{heading}</span> 
                            </NavLink>
                        </li>   
                    </ul>                                          
                </div>
            </div>              
        </nav>              
    );
  }

}

export default withRouter(Header);
