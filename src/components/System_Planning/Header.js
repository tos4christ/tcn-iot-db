import React from 'react';
import {NavLink, Link, withRouter} from 'react-router-dom';
import ls from 'local-storage';
import logo from '../img/tcnLogo.png';
import logo_2 from '../../assets/img/niso_logo_main_small.jpg';

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
    if(location === '/' || location === '/api/v1/auth/signin' || location === '/signin' || !ls.get('token')) {
      heading = 'Sign In';
    } else if(location === '/bilateral_signin' || location === '/bilateral_updatepassword') {
      heading = 'Sign Out';
    }
    return (      
        <nav className='nav-containers container-fluid'>            
                <div className='navbar-header'>
                    <Link to='/' className='navbar-brand'>
                        <img className='homelogo' src={logo_2} alt="site logo"/>
                    </Link>
                </div>
                <div className="navbar-body" >
                    <ul className="nav-container">
                        <li className='nav-item'>

                        </li>
                        <li className='nav-item'>   
                            
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/'>SP News</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/tcnnaspage'>SP Tour</NavLink>
                        </li>
                        <li className='nav-item'>

                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/bilateral_signin'>{heading}</NavLink>
                        </li>
                    </ul>                                          
                </div>
        </nav>              
    );
  }

}

export default withRouter(Header);
