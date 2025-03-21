import React from "react";
import { withRouter, Redirect } from 'react-router-dom';
import socket from "./utility/socketIO";
import DateTime from "./DateTime";
import Modal from "./Modal";

 class NDPHC_Page extends React.Component {
   constructor(props) {
     super(props);
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      frequency: "",      
      connected: false,
      ModalState: false,
      modal_data: "",
      phoenix: {},
      pulkitSteel: {},
      sunflag: {},
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/ndphc_bilaterals") {
      socket.on("client_message_ndphc", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();        
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          return returnObject;
        })
      });
      socket.on("frequency001", data => {
        const { message } = data;
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) { console(e) }        
        const returnObject = {}
        this.setState(prevState => {
          prevState["frequency"] = parsedMessage;
          returnObject["frequency"] = prevState["frequency"];
          return returnObject;
        })
      });
    }
   }
   getEpoch(time) {
    if(!time || time === undefined || time === null) {
      return 0;
    }
    // Convert the time input to epoch time
    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date().toLocaleDateString("en-GB", options).split('/').reverse().join('-');
    const timeTemp = time.split(':');
    const hour = timeTemp[0];
    const minute = timeTemp[1]
    const seconds = timeTemp[2]
    const dateTemp = date.split('-');
    return new Date(Number(dateTemp[0]), Number(dateTemp[1]-1), Number(dateTemp[2]), Number(hour), Number(minute), Number(seconds)); 
   }
   checkConnection2(server_time) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if (server_time === undefined || server_time === null) {
      return disconnected
    }
    try {
      // Get current epoch time
      const time_now = (new Date()).getTime();     
      // if 30 seconds have passed without the time changing from the current time then return disconnected
      // 30 seconds equals to 30,000 milliseconds
      // if the time difference is greater than time_diff then return disconnected
      const time_diff = (time_now - server_time) > 30000;
      if (server_time.length === 0 || time_diff ) {
          return disconnected
      } else if (!isNaN(server_time)) {
          return connected
      }
    } catch(e) {
      console.log(e);
      return disconnected;
    }
   }
   checkConnection3(t1, t2) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null)) {
      return disconnected
    }
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      // Get current epoch time
      const time_now = (new Date()).getTime();
      // if 30 seconds have passed without the time changing from the current time then return disconnected
      // 30 seconds equals to 30,000 milliseconds
      // if the time difference is greater than time_diff then return disconnected
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      if ( time_diff_1 || time_diff_2 ) {
        return disconnected
      } else if (!isNaN(t1) && !isNaN(t2)) {
          return connected
      } 
    } catch(e) {
      console.log(e);
      return disconnected;
    }    
   }
   onClickDisplay(e) {
    e.preventDefault();

   }
   setModalTrue(e, station_name) {
    // e.preventDefault();
    //console.log(e.target.innerHTML, station_name);
    return this.setState({ModalState: true, modal_data: station_name});
   }
   setModalFalse() {
    this.setState({ModalState: false});
   }
  render() {
    // const { isLoggedIn } = this.props;
    // const token = localStorage.getItem("token");
    // if (!isLoggedIn || token === null) {
    //   return <Redirect to={'/'}/>
    // }
    
    let {phoenix} = this.state;
    let {pulkitSteel} = this.state;
    let {sunflag} = this.state;
    phoenix = phoenix.transformers ? phoenix.transformers[0]?.td : {};
    pulkitSteel = pulkitSteel.lines ? pulkitSteel.lines[0]?.td : {};
    sunflag = sunflag.lines ? sunflag.lines[0]?.gd : {};

    const totalConsumption = (isNaN(Number(phoenix?.mw)) ? 0 : Math.abs(Number(phoenix.mw))) 
                            + (isNaN(Number(pulkitSteel?.mw)) ? 0 : Math.abs(Number(pulkitSteel.mw))) + 
                            (isNaN(Number(sunflag?.mw)) ? 0 : Math.abs(Number(sunflag.mw)));
 
    return (
      <>
      <div className="ncc-menu">
        <div className="ncc-menu-list">
          <div className="ncc-display-div">
            <h2><DateTime /></h2>
            <h2 className="text-danger">NDPHC IoT Bilateral TABLE  -- Frequency:  {this.state.frequency.value ? this.state.frequency.value : ""}Hz</h2>
            <table className="ncc-tg">
              <thead>
                <tr>
                  <th className="ncc-tg-zb4j">S/N</th>
                  <th className="ncc-tg-zb4j">STATIONS</th>
                  <th className="ncc-tg-zb4j">STATUS</th>
                  <th className="ncc-tg-zb4j">POWER(MW)</th>
                  <th className="ncc-tg-zb4j text-danger">VOLTAGE(kV)</th>
                </tr>
              </thead>
              <tbody>                
                <tr onClick={(e) => { this.setModalTrue(e, ['PHEONIX STEEL IKORODU', this.state.phoenix]); }}>
                  <td>1</td>
                  <td>PHEONIX STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.phoenix.server_time)}</td>
                  <td>{Math.abs(phoenix.mw)}</td>
                  <td>{phoenix.v}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['PULKIT ALLOY & STEEL IKORODU', this.state.pulkitSteel]); }}>
                  <td>2</td>
                  <td>PULKIT ALLOY & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.pulkitSteel.server_time)}</td>
                  <td>{Math.abs(pulkitSteel.mw)}</td>
                  <td>{pulkitSteel.v}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['SUNFLAG IRON & STEEL IKORODU', this.state.sunflag]); }}>
                  <td>3</td>
                  <td>SUNFLAG IRON & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{Math.abs(sunflag.mw)}</td>
                  <td>{sunflag.v}</td>
                </tr>

                <tr></tr>
                <tr>
                  <td></td>
                  <td>TOTAL CONSUMPTION</td>
                  <td></td>
                  <td>{totalConsumption.toFixed(2)}</td>
                  <td></td>
                </tr> 
              </tbody>
            </table>            
          </div>
          <div className="ncc-counter-div">
            <table className="ncc-counter-tg">
                <thead>
                    <tr>
                    <th className="ncc-counter-tg-zb4j"></th>
                    <th className="ncc-counter-tg-zb4j">LEGEND</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>CN</td>
                    <td>CONNECTED</td>
                    </tr>
                    <tr>
                    <td>NC</td>
                    <td>NOT CONNECTED</td>
                    </tr>
                    <tr>
                    <td>PNDG</td>
                    <td>PENDING</td>
                    </tr>                                        
                </tbody>
                </table> 
          </div>
        </div>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(NDPHC_Page);
