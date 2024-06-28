import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";

 class FrequencyTest extends React.Component {
   constructor(props) {
     super(props);
     this.state = { 
      frequency: "",      
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/frequency_test") {      
      socket.on("frequency001", data => {
        const { message } = data;
        const parsedMessage = JSON.parse(message);
        const returnObject = {}
        this.setState(prevState => {
          prevState["frequency"] = parsedMessage;
          returnObject["frequency"] = prevState["frequency"]
          return returnObject;
        })
      });
    }
   }
   
  render() { 
    return (
      <>
      <div className="ncc-menu">
        <div className="ncc-menu-list">
          <div className="ncc-display-div">
            <h2 className="text-danger">NCC FREQUENCY TEST</h2>
            <table className="ncc-tg">
              <thead>
                <tr>
                  <th className="ncc-tg-zb4j">TIME</th>
                  <th className="ncc-tg-zb4j">FREQUENCY</th>
                </tr>
              </thead>
              <tbody>
                <tr>                  
                  <td>{this.state.frequency.t ? this.state.frequency.t : ""}</td>                  
                  <td>{this.state.frequency.value ? this.state.frequency.value : ""}Hz</td>
                </tr>                
              </tbody>
            </table>            
          </div>
          <div className="ncc-counter-div">
            
          </div>
        </div>              
      </div>
    </>
    )         
  }
}

export default withRouter(FrequencyTest);
