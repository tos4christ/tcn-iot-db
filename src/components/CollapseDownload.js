import React from "react";
import {Redirect} from 'react-router-dom';
import { Spinner, Button } from "react-bootstrap";

 class Collapse extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      startDate: '',
      endDate : '',
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
    const endDate = this.state.endDate[0];
    const startTime = this.state.startDate[1];
    const endTime = this.state.endDate[1];
    const token = localStorage.getItem("token");
    // verify that the startDate is lower than the endDate
    // This is already handled at the backend by replacing the lower to be the start
    const getCollapse = startDate && endDate && startTime && endTime;
    if(getCollapse) {
      const url = '/lines/collapse';
      const data = {
        startDate,
        endDate,
        startTime,
        endTime
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
            a.download = "collapse.xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again 
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
          <h2 className="history-text"> Get Report </h2>
          {/* Select Start Date */}    
          <div className="options">
            <label> Start Date </label> 
            <input type={'datetime-local'} name="startDate" onChange={this.setDate} ref={node => this.startDate = node}></input>
          </div>
          {/* Select End Date */}
          <div className="options">
            <label> End Date </label>
            <input type={'datetime-local'} name='endDate' onChange={this.setDate} ref={node => this.endDate = node}></input>
          </div>
          <button className="submit-button" onClick={this.handleSubmit}> Download Report </button>
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
            Loading... Please Wait
          </Button>
            : 
            <div>
              {/* Return something */}
            </div>
          }         
        </div>
      </div> 
    )         
  }
}

export default Collapse
