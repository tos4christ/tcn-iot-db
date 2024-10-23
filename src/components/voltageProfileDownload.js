import React from "react";
import {Redirect} from 'react-router-dom';
import { Spinner, Button } from "react-bootstrap";

 class VoltageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.handleSubmitLoad = this.handleSubmitLoad.bind(this);
    this.state = {
      startDate_load: '',
      loading: false
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
    // console.log(startDate, startTime, 'the start date and time');
    const token = localStorage.getItem("token");
    // verify that the startDate is lower than the endDate
    // This is already handled at the backend by replacing the lower to be the start
    const getTem = startDate;
    if(getTem) {
      const url = '/lines/voltageprofile';
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
          a.download = "voltage_profile.xlsx";
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
    if (!isLoggedIn && token.length < 1) {
      return <Redirect to={'/'}/>
    }
    const { loading } = this.state;
    return (
      <div className="item-div">
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/home"> back</a>        
        <div>
          <h2 className="history-text"> Select a Date to download Transmission Assets Voltage Profile</h2>
          <div className="line"> </div>
          {/* Select Start Date */}    
          <div className="tem options">
            <label> Report Date </label> 
            <input type={'date'} name="startDate_load" onChange={this.setDate} ref={node => this.startDate_load = node}></input>
          </div>
          <div className="line"> </div>
          <button className=" tem submit-button" onClick={this.handleSubmitLoad}> Download Data </button>
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

export default VoltageProfile;
