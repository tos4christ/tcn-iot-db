import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import Modal from "./Modal";
import { BilateralTable, HarmonicsSection } from './BilateralHarmonics';

 class Sakete_Page extends React.Component {
   constructor(props) {
     super(props);
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      "ikejaWest-sakate": {},
      connected: false,
      ModalState: false,
      modal_data: "TAOPEX"
     };
   }
   
   componentDidMount() {
    if(this.props.history.location.pathname === "/sakete_bilaterals") {
      socket.on("client_message_sakete", data => {
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
    }
   }
    componentWillUnmount() {
    socket.off("client_message_sakete");
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
   setModalTrue(e, station_name) {
    // e.preventDefault();
    //console.log(e.target.innerHTML, station_name);
    return this.setState({ModalState: true, modal_data: station_name});
   }
   setModalFalse() {
    this.setState({ModalState: false});
   }
   
  render() {
    let ikejaWest_sakate = this.state["ikejaWest-sakate"];
    ikejaWest_sakate = ikejaWest_sakate.lines ? ikejaWest_sakate.lines[0]?.td : {};
    
    const totalBilateral = (isNaN(Number(ikejaWest_sakate.mw)) ? 0 : Number(ikejaWest_sakate.mw))   
        
    // Every value below is this page's original calculation; only the table around it changed.
    const rows = [
      {
        sn: 1, label: "Ikeja West - Sakete 330kV Line 1",
        status: this.checkConnection2(this.state["ikejaWest-sakate"].server_time),
        mw: isNaN(Number(ikejaWest_sakate.mw)) ? 0 : Number(ikejaWest_sakate.mw).toFixed(2),
        kv: ikejaWest_sakate.v ? ikejaWest_sakate.v : 0,
        data: this.state["ikejaWest-sakate"],
        modal: ['ikejaWest-sakate', this.state["ikejaWest-sakate"]],
      },
    ];

    return (
      <>
      <div className="gx-root">
        <BilateralTable
          title="Sakete bilateral"
          tableTitle="Bilateral stations"
          rows={rows}
          total={totalBilateral}
          totalLabel="Total"
          onRowClick={(modal) => this.setModalTrue(null, modal)}
        />
        <main className="gx-main hx-under"><HarmonicsSection group="sakete" title="Harmonics analysis: Sakete" /></main>
        {this.state.ModalState && <Modal setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </div>      
    </>
    )         
  }
}

export default withRouter(Sakete_Page);
