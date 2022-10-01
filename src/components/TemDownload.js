import React from "react";
import {Redirect} from 'react-router-dom';
import { Spinner, Button } from "react-bootstrap";

 class Tem extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      startDate: '',
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
  handleSubmit() {
    const startDate = this.state.startDate[0];
    // console.log(startDate, startTime, 'the start date and time');
    const token = localStorage.getItem("token");
    // verify that the startDate is lower than the endDate
    // This is already handled at the backend by replacing the lower to be the start
    const getTem = startDate;
    if(getTem) {
      const url = '/lines/tem';
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
        .then(response => response.json())
        .then( resp => {
          // respond to message of download with a carousel or just send the user back to the tems page
        });
      })      
    }    
  }
  render() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to={'/'}/>
    }
    const { loading } = this.state;
    return (
      <div className="item-div">
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/home"> back</a>        
        <div>
          <h2 className="history-text"> Select a Date to download Generation Assets</h2>
          {/* Select Start Date */}    
          <div className="options">
            <label> Report Date </label> 
            <input type={'date'} name="startDate" onChange={this.setDate} ref={node => this.startDate = node}></input>
          </div>
          <button className="submit-button" onClick={this.handleSubmit}> Download Data </button>
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

export default Tem;
