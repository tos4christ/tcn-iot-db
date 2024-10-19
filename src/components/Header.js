import React from 'react';
import {NavLink, Link, withRouter} from 'react-router-dom';
import ls from 'local-storage';
import logo from './img/tcnLogo.png';

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
    let heading;
    const location = this.props.location.pathname;
    if(location === '/' || location === '/api/v1/auth/signin' || location === '/signout' || !ls.get('token')) {
      heading = 'Sign In';
    } else {
      heading = 'Sign Out';
    }
    return (      
        <nav className='nav-containers container-fluid'>            
                <div className='navbar-header'>
                    <Link to='/' className='navbar-brand'>
                        <img className='homelogo' src={logo} alt="site logo"/>
                    </Link>
                </div>
                <div className="navbar-body" >
                    <ul className="nav-container">
                        <li className='nav-item'>

                        </li>
                        <li className='nav-item'>   
                            <NavLink className='nav-link' to='/'>Developer</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/'>IOT News</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/nccnasfullpage'>Tour</NavLink>
                        </li>
                        <li className='nav-item'>

                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/'>{heading}</NavLink>
                        </li>
                    </ul>                                          
                </div>
        </nav>              
    );
  }

}

export default withRouter(Header);
