import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import get_stations from "./stations_adder";
import DateTime from "./DateTime";
import Modal from "./Modal";

 class Bilateral extends React.Component {
   constructor(props) {
     super(props);
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      frequency: "",
      sagamu: {},
      sunflag: {},
      egbinPs: {},
      kainjiTs: {},
      jebbaTs: {},
      okpaiGs: {},
      deltaGs: {},
      omotosho2: {},
      omotosho1: {},
      eket: {},
      phMain: {},
      afamViTs: {},
      alaoji: {},
      sapeleNippPs: {},
      connected: false,
      ModalState: false
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/bilaterals") {
      socket.on("client_message_111", data => {
        const { message } = data;
        const parsedMessage = JSON.parse(message);
        parsedMessage.server_time = (new Date).getTime();
        const station = parsedMessage.id;
        const returnObject = {}
        // console.log(parsedMessage, 'c1 message');
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station]
          return returnObject;
        })
      });
      socket.on("client_message_222", data => {
        const { message } = data;
        const parsedMessage = JSON.parse(message);
        parsedMessage.server_time = (new Date).getTime();
        const station = parsedMessage.id;
        const returnObject = {}
        // console.log(parsedMessage, 'c2 message');
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station]
          return returnObject;
        })
      });
      socket.on("frequency000", data => {
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
   getEpoch(time) {
    if(!time || time == undefined || time == null) {
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
      const time_now = (new Date).getTime();     
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
      const time_now = (new Date).getTime();
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
   checkConnection4(t1, t2, t3) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null) && (t3 === undefined || t3 === null)) {
      return disconnected
    }
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      t3 = t3 ? t3 : '';
      // Get current epoch time
      const time_now = (new Date).getTime();  
      // if 30 seconds have passed without the time changing from the current time then return disconnected
      // 30 seconds equals to 30,000 milliseconds
      // if the time difference is greater than time_diff then return disconnected
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      const time_diff_3 = (time_now - t3) > 30000;
      if ( time_diff_1 || time_diff_2 || time_diff_3 ) {
        return disconnected
      } else if (!isNaN(t1) && !isNaN(t2) && !isNaN(t3)) {
          return connected
      }
    } catch(e) {
      console.log(e);
      return disconnected;
    }    
   }
   checkConnection3_b(t1, t2) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if ((t1 === undefined || t1 === null) && (t2 === undefined || t2 === null)) {
      return disconnected
    }
    try {
      t1 = t1 ? t1 : '';
      t2 = t2 ? t2 : '';
      // Get current epoch time
      const time_now = (new Date).getTime();
      // if 30 seconds have passed without the time changing from the current time then return disconnected
      // 30 seconds equals to 30,000 milliseconds
      // if the time difference is greater than time_diff then return disconnected
      const time_diff_1 = (time_now - t1) > 30000;
      const time_diff_2 = (time_now - t2) > 30000;
      if ( time_diff_1 && time_diff_2 ) {
        return disconnected
      } else if (!isNaN(t1) || !isNaN(t2)) {
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
    console.log(e.target.innerHTML, station_name);
    return this.setState({ModalState: true, modal_data: station_name});
   }
   setModalFalse() {
    this.setState({ModalState: false});
   }
  render() {
    const stations_array = get_stations(this.state);
    const sunflag = stations_array['SUNFLAG'];
    const sagamu = stations_array['SAGAMU'];    

    const totalGeneration = (Number(sunflag.mw) < 0 ? 0 : Number(sunflag.mw)) + (Number(sagamu.mw) < 0 ? 0 : Number(sagamu.mw));
        
    return (
      <>
      <div className="ncc-menu">
        <div className="ncc-menu-list">
          <div className="ncc-display-div">
            <h2><DateTime /></h2>
            <h2 className="text-danger">IoT BILATERAL TABLE </h2>
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
                <tr  onClick={(e) => { this.setModalTrue(e, 'SUNFLAG'); }}>
                  <td>1</td>
                  <td>PHONIX STEEL MILLS INDUSTRIES LTD (IBEDC) 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>AFRICAN FOUNDARIES LTD (IBEDC) 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>MONARCH (IBEDC) 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>REAL INFRASTRUCTURE NIGERIA LTD (IBEDC)</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>SAGAMU STEEL</td>
                  <td>{this.checkConnection2(this.state.sagamu.server_time)}</td>
                  <td>{sagamu.mw}</td>
                  <td>{sagamu.kv}</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>KAM STEEL SAGAMU (IBEDC) 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>CEMENT FACTORY (IBEDC) 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>TOP STEEL NIGERIA LTD (IKEJA DISCO) 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>SUNFLAG IRON AND STEEL COMPANY LTD 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>PULKIT ALLOY AND STEEL LTD 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>STAR PIPE PRODUCT LTD 132KV</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>ODOGUNNYAN 132KV TS</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>IKORODU 132KV TS</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>                                
                <tr>
                  <td>29</td>
                  <td>SAGAMU 132KV TS</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr></tr>
                <tr>
                  <td></td>
                  <td>TOTAL BILLATERAL</td>
                  <td></td>
                  <td>{totalGeneration.toFixed(2)}</td>
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

export default withRouter(Bilateral);
