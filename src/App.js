import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import './assets/css/Modal.css'
//import bootstrap from 'bootstrap'; // eslint-disable-line no-unused-vars
//import 'bootstrap/dist/js/bootstrap'
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "./components/css/icofont.css";
import "./components/css/font-awesome.min.css";
import Home from './components/Home';
import Header from './components/Header';
import SignUp from '../src/components/Users/SignUp';
import SignIn from '../src/components/Users/SignIn';
import Downtime from './components/Downtime';
import History from './components/History';
import Profile from './components/Profile';
import Uptime from './components/Uptime';
import Average from './components/Average';
import PageOne from './components/PageOne';
import PageTwo from './components/PageTwo';
import FullPage from './components/FullPage';
import UpdatePassword from './components/Users/UpdatePassword';
import Tem from './components/TemDownload';
import Collapse from './components/CollapseDownload';
// import Footer from './components/Footer';
import WeatherApi from './components/WeatherApi';
import WeatherApp from './components/Weather/WeatherWidget_single';
import Index from "./pages/Index";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import Disco from "./pages/Disco";
import TCN from "./pages/Tcn";
import UserLogin from "./pages/UserLogin";
import Bilateral from './components/Bilateral';
// import FrequencyTest from './components/FrequencyTest';
import WeatherDownload from './components/WeatherDownload';
import VoltageProfile from './components/voltageProfileDownload';
import MESL_Page from './components/MESL_Page';
import FIPL_Page from './components/FIPL_Page';
import TAOPEX_Page from './components/TAOPEX_Page';
import NDPHC_Page from './components/NDPHC_Page';
import BILATERAL_Page from './components/BILATERAL_Page';


class App extends React.Component {
  setUserDetails() {

  }
  componentDidMount() {
    //localStorage.setItem("isLoggedIn", true);
  }
  render() {
    return (
      <Router>
        <Switch >
          <Route exact path={'/'}>
            <div className='App'>              
              <Header />
              <Home isLoggedIn={localStorage.getItem("isLoggedIn")}/>
              {/* <SignIn /> */}
            </div>
          </Route>
          <Route  exact path={'/signin'}>
            <div className='App'>              
              <Header />
              <SignIn />
            </div>
          </Route>
          <Route exact path={'/signup'}>
            <div className='App'>              
              <Header />
              <SignUp />
            </div>
          </Route>
          <Route exact path={'/updatepassword'}>
            <div className='App'>              
              <Header />
              <UpdatePassword />
            </div>
          </Route>
          {/* This is the protected path after successful login */}
          <Route exact path={'/home'} >
            <div className="App">
              <Header />
              <Home isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>          
          <Route exact path={`/downtime`}>
            <div className='App'>
              <Header />
              <Downtime isLoggedIn={localStorage.getItem("isLoggedIn")}/> 
            </div>            
          </Route>
          <Route exact path={`/uptime`}>
            <div className='App'>
              <Header />
              <Uptime isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/history`}>
            <div className='App'>
              <Header />
              <History isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>             
          </Route>
          <Route exact path={`/profile`}>
            <div className='App'>
              <Header />
              <Profile isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>            
          </Route>
          <Route exact path={`/average`}>
            <div className='App'>
              <Header />
              <Average isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>            
          </Route>
          <Route exact path={`/tem`}>
            <div className='App'>
              <Header />
              <Tem isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>            
          </Route>
          <Route exact path={`/voltageprofile`}>
            <div className='App'>
              <Header />
              <VoltageProfile isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>            
          </Route>
          <Route exact path={`/weather_download`}>
            <div className='App'>
              <Header />
              <WeatherDownload isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>            
          </Route>
          <Route exact path={`/collapse`}>
            <div className='App'>
              <Header />
              <Collapse isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>            
          </Route>
          <Route exact path={`/gridpageone`}>
            <div className='App'>
              <PageOne isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>                         
          </Route>
          <Route exact path={`/gridpagetwo`}>              
            <div className='App'>
              <PageTwo isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/tcnnaspage`}>              
            <div className='App'>
              <FullPage isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/secure_tcnnaspage`}>              
            <div className='App'>
              <FullPage isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/bilaterals`}>              
            <div className='App'>
              <Bilateral />
            </div>
          </Route>
          <Route exact path={`/bilateral`}>              
            <div className='App'>
              <BILATERAL_Page />
            </div>
          </Route>
          <Route exact path={`/mesl_bilaterals`}>              
            <div className='mesl_background'>
              <MESL_Page isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/fipl_bilaterals`}>
            <div className='fipl_background'>
              <FIPL_Page isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/taopex_bilaterals`}>
            <div className='taopex_background'>
              <TAOPEX_Page isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          <Route exact path={`/ndphc_bilaterals`}>
            <div className='ndphc_background'>
              <NDPHC_Page isLoggedIn={localStorage.getItem("isLoggedIn")}/>
            </div>
          </Route>
          {/* <Route exact path={`/frequency_test`}>              
            <div className='App'>
              <FrequencyTest />
            </div>
          </Route> */}
          <Route exact path={`/nccweather`}>
            <div className='weather_background'>
              <WeatherApi />  
            </div>                     
          </Route>
          <Route exact path={`/nccweather2`}>
              <WeatherApp />         
          </Route>
          <Route exact path="/api/tickets">
            <Index />
          </Route>
          <Route path="/api/tickets/login">
            <UserLogin />
          </Route>
          <Route path="/api/tickets/register">
            <Register />
          </Route>
          <Route path="/api/tickets/dashboard">
            <DashboardHome />
          </Route>
          <Route path="/api/tickets/disco">
            <Disco />
          </Route>
          <Route path="/api/tickets/tcn">
            <TCN />
          </Route>
        </Switch>
        {/* <Footer /> */}
      </Router>      
    )    
  };
}

export default App;
