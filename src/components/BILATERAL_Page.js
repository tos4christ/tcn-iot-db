import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import DateTime from "./DateTime";
import Modal from "./Modal";

 class All_Bilateral extends React.Component {
   constructor(props) {
     super(props);
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      pheonix: {},
      pulkitSteel: {},
      sunflag: {},
      'Obafemi Awolowo University Ile-Ife': {},
      'First Maximum Point Industries Akure': {},
      zeberced: {},
      Niamey: {},
      Inner_Galaxy2: {},
      Inner_Galaxy1: {},
      PSML: {},
      ATVL: {},
      Gazaoua: {},
      kam: {},
      KamInd33kV: {},
      quantum: {},
      'kamSteel': {},
      'kamSteel-Ilorin': {},
      'Er-Kang': {},

      connected: false,
      ModalState: false,
      modal_data: "TAOPEX"
     };
   }
   
   componentDidMount() {
    if(this.props.history.location.pathname === "/all_bilateral") {
      socket.on("client_message_taopex", data => {
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
      socket.on("client_message_mesl", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        // console.log(parsedMessage, 'c1 message');
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station]
          return returnObject;
        })
      });
      socket.on("client_message_fipl", data => {
        const { message } = data;
        let parsedMessage = {};
        try {
          parsedMessage = JSON.parse(message);
        } catch(e) {} 
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.name ? parsedMessage.name : parsedMessage.id ? parsedMessage.id : null;
        const returnObject = {}
        // console.log(parsedMessage, 'c1 message');
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station];
          // remove this later
          // console.log(returnObject);
          return returnObject;
        })
      });
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
   setModalTrue(e, station_name) {
    // e.preventDefault();
    //console.log(e.target.innerHTML, station_name);
    return this.setState({ModalState: true, modal_data: station_name});
   }
   setModalFalse() {
    this.setState({ModalState: false});
   }
   
  render() {
    let {pheonix} = this.state;
    let {pulkitSteel} = this.state;
    let {sunflag} = this.state;
    pheonix = pheonix.transformers ? pheonix.transformers[0]?.td : {};
    pulkitSteel = pulkitSteel.lines ? pulkitSteel.lines[0]?.td : {};
    sunflag = sunflag.lines ? sunflag.lines[0]?.gd : {};
    const FMPIA = this.state["First Maximum Point Industries Akure"];
    const OAUI = this.state["Obafemi Awolowo University Ile-Ife"];
    const {zeberced} = this.state;
    const {Niamey} = this.state;
    const {Inner_Galaxy1} = this.state;
    const {Inner_Galaxy2} = this.state;
    const {PSML} = this.state;
    const {ATVL} = this.state;
    const {KamInd33kV} = this.state;
    const {Gazaoua} = this.state;
    const quantum = this.state.quantum.transformers ? this.state.quantum.transformers[0].td : {};
    const {kamSteel} = this.state;
    const Er_Kang = this.state["Er-Kang"];
    const kamSteel_Ilorin = this.state["kamSteel-Ilorin"].name ? this.state["kamSteel-Ilorin"] : null;
    const kamSteel_Ilorin_line_1 = kamSteel_Ilorin?.lines[0] ? kamSteel_Ilorin?.lines[0] : null;
    const kamSteel_Ilorin_line_2 = kamSteel_Ilorin?.lines[1] ? kamSteel_Ilorin?.lines[1] : null;
    const kamSteel_Ilorin_line1_mw = kamSteel_Ilorin_line_1?.td?.mw;
    const kamSteel_Ilorin_line2_mw = kamSteel_Ilorin_line_2?.td?.mw;
    const kamSteel_Ilorin_voltage = kamSteel_Ilorin_line_1?.td?.v ? kamSteel_Ilorin_line_1?.td?.v : kamSteel_Ilorin_line_2?.td?.v ? kamSteel_Ilorin_line_2?.td?.v : 0;
    const kamSteel_Ilorin_mw_sum = Number(kamSteel_Ilorin_line1_mw) + Number(kamSteel_Ilorin_line2_mw);

    const totalConsumption = (isNaN(Number(kamSteel.mw)) ? 0 : Number(kamSteel.mw)) + (isNaN(Number(Er_Kang.mw)) ? 0 : Number(Er_Kang.mw))
                            + (isNaN(Number(kamSteel_Ilorin_mw_sum)) ? 0 : Number(kamSteel_Ilorin_mw_sum)) +
    (isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw)) + 
    (isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw)) + (isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw))) +
    (isNaN(Number(Inner_Galaxy1.mw)) ? 0 :  Number(Inner_Galaxy1.mw)) + (isNaN(Number(Gazaoua.mw)) ? 0 :  Math.abs(Number(Gazaoua.mw))) + 
    (isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw)) + (isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw)) +
    (isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw)) + (isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw))) +
(isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw)) + (isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw)) +
(isNaN(Number(pheonix?.mw)) ? 0 : Math.abs(Number(pheonix.mw))) 
                            + (isNaN(Number(pulkitSteel?.mw)) ? 0 : Math.abs(Number(pulkitSteel.mw))) + 
                            (isNaN(Number(sunflag?.mw)) ? 0 : Math.abs(Number(sunflag.mw)));
    
        
    return (
      <>
      <div className="bl-menu">
        <div className="bl-menu-list">
          <div className="bl-display-div">
            <h2><DateTime /></h2>
            <h2 className="text-danger"> BILATERALS </h2>
            <table className="bl-tg">
              <thead>
                <tr>
                  <th className="bl-tg-zb4j">S/N</th>
                  <th className="bl-tg-zb4j">STATIONS</th>
                  <th className="bl-tg-zb4j">STATUS</th>
                  <th className="bl-tg-zb4j">POWER(MW)</th>
                  <th className="bl-tg-zb4j text-danger">VOLTAGE(kV)</th>
                </tr>
              </thead>
              <tbody>
                
              <tr onClick={(e) => { this.setModalTrue(e, ['PHEONIX STEEL IKORODU', this.state.pheonix]); }}>
                  <td>1</td>
                  <td>PHEONIX STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.pheonix.server_time)}</td>
                  <td>{Math.abs(pheonix.mw)}</td>
                  <td>{pheonix.V}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['PULKIT ALLOY & STEEL IKORODU', this.state.pulkitSteel]); }}>
                  <td>2</td>
                  <td>PULKIT ALLOY & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.pulkitSteel.server_time)}</td>
                  <td>{Math.abs(pulkitSteel.mw)}</td>
                  <td>{pulkitSteel.V}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['SUNFLAG IRON & STEEL IKORODU', this.state.sunflag]); }}>
                  <td>3</td>
                  <td>SUNFLAG IRON & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{Math.abs(sunflag.mw)}</td>
                  <td>{sunflag.V}</td>
                </tr>

                <tr  onClick={(e) => { this.setModalTrue(e, ['FMPIA', this.state["First Maximum Point Industries Akure"]]); }}>
                  <td>1</td>
                  <td>First Maximum Point Industries Akure</td>
                  <td>{this.checkConnection2(this.state["First Maximum Point Industries Akure"].server_time)}</td>
                  <td>{isNaN(Number(FMPIA.mw)) ? 0 : Number(FMPIA.mw).toFixed(2)}</td>
                  <td>{FMPIA.v ? FMPIA.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['OAUI', this.state["Obafemi Awolowo University Ile-Ife"]]); }}>
                  <td>2</td>
                  <td>Obafemi Awolowo University Ile-Ife</td>
                  <td>{this.checkConnection2(this.state["Obafemi Awolowo University Ile-Ife"].server_time)}</td>
                  <td>{isNaN(Number(OAUI.mw)) ? 0 : Number(OAUI.mw).toFixed(2)}</td>
                  <td>{OAUI.v ? OAUI.v : 0}</td>
                </tr>

                <tr  onClick={(e) => { this.setModalTrue(e, ['ZEBERCED', this.state.zeberced]); }}>
                  <td>1</td>
                  <td>ZEBERCED</td>
                  <td>{this.checkConnection2(this.state.zeberced.server_time)}</td>
                  <td>{isNaN(Number(zeberced.mw)) ? 0 : Number(zeberced.mw).toFixed(2)}</td>
                  <td>{zeberced.v ? zeberced.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['NIAMEY', this.state.Niamey]); }}>
                  <td>2</td>
                  <td>NIAMEY</td>
                  <td>{this.checkConnection2(this.state.Niamey.server_time)}</td>
                  <td>{isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw).toFixed(2)}</td>
                  <td>{Niamey.v ? Niamey.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['INNER GALAXY 1', this.state.Inner_Galaxy1]); }}>
                  <td>3</td>
                  <td>INNER GALAXY 1</td>
                  <td>{this.checkConnection2(this.state.Inner_Galaxy1.server_time)}</td>
                  <td>{isNaN(Number(Inner_Galaxy1.mw)) ? 0 : Number(Inner_Galaxy1.mw).toFixed(2)}</td>
                  <td>{Inner_Galaxy1.v ? Inner_Galaxy1.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['INNER GALAXY 2', this.state.Inner_Galaxy2]); }}>
                  <td>4</td>
                  <td>INNER GALAXY 2</td>
                  <td>{this.checkConnection2(this.state.Inner_Galaxy2.server_time)}</td>
                  <td>{isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw).toFixed(2)}</td>
                  <td>{Inner_Galaxy2.v ? Inner_Galaxy2.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['PSML', this.state.PSML]); }}>
                  <td>5</td>
                  <td>PRISM</td>
                  <td>{this.checkConnection2(this.state.PSML.server_time)}</td>
                  <td>{isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw).toFixed(2)}</td>
                  <td>{PSML.v ? PSML.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['ATVL', this.state.ATVL]); }}>
                  <td>6</td>
                  <td>ATVL</td>
                  <td>{this.checkConnection2(this.state.ATVL.server_time)}</td>
                  <td>{isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw).toFixed(2))}</td>
                  <td>{ATVL.v ? ATVL.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['GAZAOUA', this.state.Gazaoua]); }}>
                  <td>7</td>
                  <td>GAZAOUA</td>
                  <td>{this.checkConnection2(this.state.Gazaoua.server_time)}</td>
                  <td>{isNaN(Number(Gazaoua.mw)) ? 0 : Math.abs(Number(Gazaoua.mw)).toFixed(2)}</td>
                  <td>{Gazaoua.v ? Gazaoua.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['KAM', this.state.KamInd33kV]); }}>
                  <td>8</td>
                  <td>KAM</td>
                  <td>{this.checkConnection2(this.state.KamInd33kV.server_time)}</td>
                  <td>{isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw).toFixed(2)}</td>
                  <td>{KamInd33kV.v ? KamInd33kV.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['Quantum', this.state.quantum]); }}>
                  <td>9</td>
                  <td>Quantum</td>
                  <td>{this.checkConnection2(this.state.quantum.server_time)}</td>
                  <td>{isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw).toFixed(2))}</td>
                  <td>{quantum.V ? quantum.V : 0}</td>
                </tr>

                <tr  onClick={(e) => { this.setModalTrue(e, ['kamSteel', this.state.kamSteel]); }}>
                <td>1</td>
                  <td>kam Steel Shagamu</td>
                  <td>{this.checkConnection2(this.state.kamSteel.server_time)}</td>
                  <td>{isNaN(Number(kamSteel.mw)) ? 0 : Number(kamSteel.mw).toFixed(2)}</td>
                  <td>{kamSteel.v ? kamSteel.v : 0}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['kamSteel-Ilorin', this.state["kamSteel-Ilorin"]]); }}>
                  <td>2</td>
                  <td>Kam Steel Integrated Ilorin</td>
                  <td>{this.checkConnection2(this.state["kamSteel-Ilorin"].server_time)}</td>
                  <td>{isNaN(Number(kamSteel_Ilorin_mw_sum)) ? 0 : Number(kamSteel_Ilorin_mw_sum).toFixed(2)}</td>
                  <td>{kamSteel_Ilorin_voltage ? kamSteel_Ilorin_voltage : 0}</td>
                </tr>
                <tr  onClick={(e) => { this.setModalTrue(e, ['Er-Kang', this.state["Er-Kang"]]); }}>
                  <td>3</td>
                  <td>ER-KANG Limited</td>
                  <td>{this.checkConnection2(this.state["Er-Kang"].server_time)}</td>
                  <td>{isNaN(Number(Er_Kang.mw)) ? 0 : Number(Er_Kang.mw).toFixed(2)}</td>
                  <td>{Er_Kang.v ? Er_Kang.v : 0}</td>
                </tr>
                
                <tr></tr>
                <tr>
                  <td></td>
                  <td>TOTAL BILATERAL</td>
                  <td></td>
                  <td>{totalBilateral.toFixed(2)}</td>
                  <td></td>
                </tr> 
              </tbody>
            </table>            
          </div>
          <div className="bl-counter-div">
            <table className="bl-counter-tg">
                <thead>
                    <tr>
                    <th className="bl-counter-tg-zb4j"></th>
                    <th className="bl-counter-tg-zb4j">LEGEND</th>
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

export default withRouter(All_Bilateral);
