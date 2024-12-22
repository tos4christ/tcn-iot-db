import React from "react";
import { withRouter, Redirect } from 'react-router-dom';
import socket from "./utility/socketIO";
import DateTime from "./DateTime";
import Modal from "./Modal";

 class MESL_Page extends React.Component {
   constructor(props) {
     super(props);
     this.setModalFalse = this.setModalFalse.bind(this);
     this.setModalTrue = this.setModalTrue.bind(this);
     this.state = { 
      frequency: "",      
      connected: false,
      ModalState: false,
      modal_data: "",
      Zeberced: {},
      Niamey: {},
      Inner_Galaxy2: {},
      Inner_Galaxy1: {},
      PSML: {},
      ATVL: {},
      gazaoua: {},
      kam: {},
      KamInd33kV: {},
      quantum: {}
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/mesl_bilaterals") {
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
    
    const {Zeberced} = this.state;
    const {Niamey} = this.state;
    const {Inner_Galaxy1} = this.state;
    const {Inner_Galaxy2} = this.state;
    const {PSML} = this.state;
    const {ATVL} = this.state;
    const {KamInd33kV} = this.state;
    // const quantum = this.state.quantum?.transformers[0]?.td ? this.state.quantum.transformers[0].td : {};
    const quantum = this.state.quantum.transformers ? this.state.quantum.transformers[0].td : {};
    // console.log(quantum, "   the quantum data");
    const totalConsumption = (isNaN(Number(Zeberced.mw)) ? 0 : Number(Zeberced.mw)) + 
    (isNaN(Number(Niamey.mw)) ? 0 : Number(Niamey.mw)) + (isNaN(Number(quantum.mw)) ? 0 : Math.abs(Number(quantum.mw))) +
    (isNaN(Number(Inner_Galaxy1.mw)) ? 0 :  Number(Inner_Galaxy1.mw)) + 
    (isNaN(Number(Inner_Galaxy2.mw)) ? 0 : Number(Inner_Galaxy2.mw)) + (isNaN(Number(KamInd33kV.mw)) ? 0 : Number(KamInd33kV.mw)) +
    (isNaN(Number(PSML.mw)) ? 0 : Number(PSML.mw)) + (isNaN(Number(ATVL.mw)) ? 0 : Math.abs(Number(ATVL.mw)));
 
    return (
      <>
      <div className="ncc-menu">
        <div className="ncc-menu-list">
          <div className="ncc-display-div">
            <h2><DateTime /></h2>
            <h2 className="text-danger">Main Stream IoT Bilateral TABLE  -- Frequency:  {this.state.frequency.value ? this.state.frequency.value : ""}Hz</h2>
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
                <tr  onClick={(e) => { this.setModalTrue(e, ['ZEBERCED', this.state.Zeberced]); }}>
                  <td>1</td>
                  <td>ZEBERCED</td>
                  <td>{this.checkConnection2(this.state.Zeberced.server_time)}</td>
                  <td>{isNaN(Number(Zeberced.mw)) ? 0 : Number(Zeberced.mw).toFixed(2)}</td>
                  <td>{Zeberced.v ? Zeberced.v : 0}</td>
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
                <tr onClick={(e) => { this.setModalTrue(e, ['GAZAOUA', this.state.gazaoua]); }}>
                  <td>7</td>
                  <td>GAZAOUA</td>
                  <td>{this.checkConnection2(this.state.gazaoua.server_time)}</td>
                  <td>{isNaN(Number(this.state.gazaoua.mw)) ? 0 : Number(this.state.gazaoua.mw).toFixed(2)}</td>
                  <td>{this.state.gazaoua.v ? this.state.gazaoua.v : 0}</td>
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
                {/* <tr onClick={(e) => { this.setModalTrue(e, ['OMOTOSHO (GAS)', this.state.omotosho2, this.state.omotosho1]); }}>
                  <td>4</td>
                  <td>OMOTOSHO (GAS)</td>
                  <td>{this.checkConnection3(this.state.omotosho2.server_time, this.state.omotosho1.server_time)}</td>
                  <td>{omotosogas_gs.mw}</td>
                  <td>{omotosogas_gs.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['OMOTOSHO NIPP (GAS)', this.state.omotoshoNippPs]); }}>
                  <td>5</td>
                  <td>OMOTOSHO NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.omotoshoNippPs.server_time)}</td>
                  <td>{omotosonipp_gs.mw}</td>
                  <td>{omotosonipp_gs.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['DELTA (GAS)', this.state.delta3, this.state.deltaGs, this.state.delta2]); }}>
                  <td>6</td>
                  <td>DELTA (GAS)</td>
                  <td>{this.checkConnection4_delta(this.state.delta3.server_time , this.state.deltaGs.server_time, this.state.delta2.server_time)}</td>
                  <td>{delta_gs.mw}</td>
                  <td>{delta_gs.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['SAPELE NIPP (GAS)', this.state.sapeleNippPs]); }}>
                  <td>7</td>
                  <td>SAPELE NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.sapeleNippPs.server_time)}</td>
                  <td>{sapelenipp_gs.mw}</td>
                  <td>{sapelenipp_gs.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['OMOKU (GAS)', this.state.omokuPs1]); }}>
                  <td>8</td>
                  <td>OMOKU (GAS)</td>
                  <td>{this.checkConnection2(this.state.omokuPs1.server_time)}</td>
                  <td>{omoku_gs.mw}</td>
                  <td>{omoku_gs.kv}</td>
                </tr> */}
                
                
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

export default withRouter(MESL_Page);
