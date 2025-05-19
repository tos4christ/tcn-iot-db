import React from "react";
import {Redirect} from 'react-router-dom';
import { Spinner, Button } from "react-bootstrap";
import axios from "axios";

 class BilateralDownload extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.handleSubmitLoad = this.handleSubmitLoad.bind(this);
    this.state = {
      verified_token_exp: {data: {decodedToken: {exp: 100000000000}}},
      timer: {time: Date.now()},
      startDate_load: '',
      loading: false
    }
  }
  componentDidMount() {
      if(this.props.history.location.pathname === "/sp_bilateral") {
        const requestBody = {token: localStorage.getItem("token")};
        axios.post("https://tcnnas.org/verifytoken/bilateral", requestBody).
          then(result => {
            console.log(result, 'verify token result');
            if(result) {
              this.setState((prevState) => {
                prevState.verified_token_exp = result.data ? result.data : null;
                return {verified_token_exp: prevState.verified_token_exp};
              });        
            } else {  
              this.setState((prevState) => {
                prevState.verified_token_exp = null;
                return {verified_token_exp: prevState.verified_token_exp};
              });
              // return <Redirect to={'/signin'}/>
              return this.props.history.push({pathname: `/bilateral_signin`});
            }
          }).catch(err => {  
            console.log(err.message);
            // return <Redirect to={'/signin'}/>
            return this.props.history.push({pathname: `/bilateral_signin`});
          });  
      }
     }
  setDate(e) {    
    const name = e.target.name;
    this.setState( prevState => {
      prevState[name] = this[name].value.split('T');
      return {name : prevState[name]}
    })
  }
  handleSubmitLoad() {
    const startDate = this.state.startDate_load[0];
    const token = localStorage.getItem("token");
    // verify that the startDate is lower than the endDate
    // This is already handled at the backend by replacing the lower to be the start
    const getTem = startDate;
    if(getTem) {
      const url = '/bilateral/download';
      const data = {
        startDate
      };
      // add a spinner method while request is loading
      this.setState({loading: true}, () => {
        fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            credentials: 'include'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.blob())
        .then( blob => {
          // Return a message
          this.setState({loading: false})
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = "bilateral.xlsx";
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove();  //afterwards we remove the element again 
        });
      })      
    }    
  }
  render() {
    const { isLoggedIn } = this.props;
    const token = localStorage.getItem("token");
    if (!isLoggedIn || token === null) {
      return <Redirect to={'/bilateral_signin'}/>
    }
    const {timer} = this.state;
    const { verified_token_exp } = this.state;
    let { exp } = verified_token_exp.data ? verified_token_exp.data.decodedToken : {exp: 100000000000};
    // let expire = 100000000000;
    // console.log(timer, "  the timer");
    // while(expire === 100000000000) {
    //   console.log("waiting for token to be verified");
    //   const { verified_token_exp } = this.state;
    //   expire = verified_token_exp.data ? verified_token_exp.data.decodedToken.exp : 100000000000;
    //   console.log(expire, "  the expire time");
    // }
    if((timer.time + 100) < Date.now()) { 
      if (verified_token_exp.status === 'Error') {
        return <Redirect to={'/bilateral_signin'}/>
      }
    }
    if((exp * 1000) < Date.now()) {
      return <Redirect to={'/bilateral_signin'}/>
    }
    // if((exp * 1000) < Date.now() || !verified_token_exp) {
    //   return <Redirect to={'/signin'}/>
    // }
    const { loading } = this.state;
    return (
      <div className="item-div">
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/systemplanning_bilateral"> back</a>        
        <div>
          <h2 className="history-text"> Select a Date to download Bilateral Data</h2>
          <div className="line"> </div>
          {/* Select Start Date */}    
          <div className="tem options">
            <label> Select a Date </label> 
            <input type={'date'} name="startDate_load" onChange={this.setDate} ref={node => this.startDate_load = node}></input>
          </div>
          <div className="line"> </div>
          <button className="tem submit-button" onClick={this.handleSubmitLoad}> Download Data </button>
        </div>
        
        <div className="table-div">
          {loading ? 
            <Button className="spinner" variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Downloading... Please Wait
          </Button>
            : 
            <div>
             {/* Display successful download message here */}
            </div>
          }         
        </div>
      </div> 
    )         
  }
}

export default BilateralDownload;
