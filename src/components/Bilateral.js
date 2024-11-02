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
      starPipe: {},
      quantum: {},
      kamSteel: {},
      sagamu: {},
      ikorodu1: {},
      ikorodu2: {},
      pheonix: {},
      pulkitSteel: {},
      africanFoundriesLimited: {},
      sunflag: {},
      topSteel: {},
      monarch: {},
      larfarge: {},
      afamIv_vPs: {},
      shiroroPs: {},
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
      omotoshoNippPs: {},
      odukpaniGs: {},
      odukpaniNippPs: {},
      ekim: {},
      gereguPs: {},
      ikotEkpene: {},
      riversIppPs: {},
      omokuPs1: {},
      ihovborNippPs: {},
      olorunsogo1: {},
      delta2: {},
      delta3: {},
      parasEnergyPs: {},
      olorunsogoPhase1Gs: {},
      gbarain: {},
      dadinKowaGs: {},
      asaba: {},
      lokojaTs: {},
      ugwuaji: {},
      gwagwalada: {},
      zungeru: {},
      taopex: {},
      afamVPs: {},
      connected: false,
      ModalState: false,
      modal_data: "TAOPEX"
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/bilaterals") {
      socket.on("client_message_111", data => {
        const { message } = data;
        const parsedMessage = JSON.parse(message);
        parsedMessage.server_time = (new Date()).getTime();
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
        parsedMessage.server_time = (new Date()).getTime();
        const station = parsedMessage.id;
        const returnObject = {}
        // console.log(parsedMessage, 'c2 message');
        this.setState(prevState => {
          prevState[station] = parsedMessage;
          returnObject[station] = prevState[station]
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
    const stations_array = get_stations(this.state);
    const sunflag = stations_array['SUNFLAG'];
    const sagamu = stations_array['SAGAMU'];
    const top_steel = stations_array['TOPSTEEL'];
    const larfarge = stations_array['LARFARGE'];
    const monarch = stations_array['MONARCH'];
    const pulkitSteel = stations_array['PULKISTEEL'];
    const africanFoundriesLimited = stations_array['AFRICANFOUNDARIES'];
    const kamSteel = stations_array['KAMSTEEL'];
    const starPipe = stations_array['STARPIPE'];
    const quantum = stations_array['QUANTUM'];
    const ikorodu_1 = stations_array['IKORODU 1'];
    const ikorodu_2 = stations_array['IKORODU 2'];
    const pheonix = stations_array['PHEONIX'];

    const totalBilateral = (Number(sunflag.mw) < 0 ? 0 : Number(sunflag.mw)) + (Number(sagamu.mw) < 0 ? 0 : Number(sagamu.mw))
    + (Number(top_steel.mw) < 0 ? 0 : Number(top_steel.mw)) + (Number(larfarge.mw) < 0 ? 0 : Number(larfarge.mw)) + 
    (Number(monarch.mw) < 0 ? 0 : Number(monarch.mw)) + (Number(pulkitSteel.mw) < 0 ? 0 : Number(pulkitSteel.mw)) + 
    (Number(africanFoundriesLimited.mw) < 0 ? 0 : Number(africanFoundriesLimited.mw)) +  
    (Number(quantum.mw) < 0 ? 0 : Number(quantum.mw)) + (Number(kamSteel.mw) < 0 ? 0 : Number(kamSteel.mw)) +
    (Number(starPipe.mw) < 0 ? 0 : Number(starPipe.mw)) + (Number(pheonix.mw) < 0 ? 0 : Number(pheonix.mw));
        
    return (
      <>
      <div className="bl-menu">
        <div className="bl-menu-list">
          <div className="bl-display-div">
            <h2><DateTime /></h2>
            <h2 className="text-danger">IoT CRITICAL 132KV & 33KV LOAD OFF-TAKERS </h2>
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
                  <td>{pheonix.mw}</td>
                  <td>{pheonix.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['AFRICAN FOUNDARIES LTD IKORODU', this.state.africanFoundriesLimited]); }}>
                  <td>2</td>
                  <td>AFRICAN FOUNDARIES LTD IKORODU</td>
                  <td>{this.checkConnection2(this.state.africanFoundriesLimited.server_time)}</td>
                  <td>{africanFoundriesLimited.mw}</td>
                  <td>{africanFoundriesLimited.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['MONARCH IKORODU', this.state.monarch]); }}>
                  <td>3</td>
                  <td>MONARCH IKORODU</td>
                  <td>{this.checkConnection2(this.state.monarch.server_time)}</td>
                  <td>{monarch.mw}</td>
                  <td>{monarch.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['REAL INFRASTRUCTURE LTD IKORODU', this.state.quantum]); }}>
                  <td>4</td>
                  <td>REAL INFRASTRUCTURE LTD IKORODU</td>
                  <td>{this.checkConnection2(this.state.quantum.server_time)}</td>
                  <td>{quantum.mw}</td>
                  <td>{quantum.kv}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>SAGAMU STEEL</td>
                  <td>{this.checkConnection2(null)}</td>
                  <td>{'N/A'}</td>
                  <td>{'N/A'}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['KAM STEEL SAGAMU', this.state.kamSteel]); }}>
                  <td>6</td>
                  <td>KAM STEEL SAGAMU</td>
                  <td>{this.checkConnection2(this.state.kamSteel.server_time)}</td>
                  <td>{kamSteel.mw}</td>
                  <td>{kamSteel.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['CEMENT FACTORY', this.state.larfarge]); }}>
                  <td>7</td>
                  <td>CEMENT FACTORY</td>
                  <td>{this.checkConnection2(this.state.larfarge.server_time)}</td>
                  <td>{larfarge.mw}</td>
                  <td>{larfarge.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['TOP STEEL IKORODU', this.state.topSteel]); }}>
                  <td>8</td>
                  <td>TOP STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.topSteel.server_time)}</td>
                  <td>{top_steel.mw}</td>
                  <td>{top_steel.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['SUNFLAG IRON & STEEL IKORODU', this.state.sunflag]); }}>
                  <td>9</td>
                  <td>SUNFLAG IRON & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.sunflag.server_time)}</td>
                  <td>{sunflag.mw}</td>
                  <td>{sunflag.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['PULKIT ALLOY & STEEL IKORODU', this.state.pulkitSteel]); }}>
                  <td>10</td>
                  <td>PULKIT ALLOY & STEEL IKORODU</td>
                  <td>{this.checkConnection2(this.state.pulkitSteel.server_time)}</td>
                  <td>{pulkitSteel.mw}</td>
                  <td>{pulkitSteel.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['STAR PIPE PRODUCT IKORODU', this.state.starPipe]); }}>
                  <td>11</td>
                  <td>STAR PIPE PRODUCT IKORODU</td>
                  <td>{this.checkConnection2(this.state.starPipe.server_time)}</td>
                  <td>{starPipe.mw}</td>
                  <td>{starPipe.kv}</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>ODOGUNNYAN 132KV TS</td>
                  <td>{this.checkConnection2(null)}</td>
                  <td>{'N/A'}</td>
                  <td>{'N/A'}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['IKORODU 132KV TS LINE_1', this.state.ikorodu1]); }}>
                  <td>13</td>
                  <td>IKORODU 132KV TS LINE_1</td>
                  <td>{this.checkConnection2(this.state.ikorodu1.server_time)}</td>
                  <td>{ikorodu_1.mw}</td>
                  <td>{ikorodu_1.kv}</td>
                </tr>
                <tr onClick={(e) => { this.setModalTrue(e, ['IKORODU 132KV TS LINE_2', this.state.ikorodu2]); }}>
                  <td>14</td>
                  <td>IKORODU 132KV TS LINE_2</td>
                  <td>{this.checkConnection2(this.state.ikorodu2.server_time)}</td>
                  <td>{ikorodu_2.mw}</td>
                  <td>{ikorodu_2.kv}</td>
                </tr> 
                <tr onClick={(e) => { this.setModalTrue(e, ['SAGAMU 132KV TS', this.state.sagamu]); }}>
                  <td>15</td>
                  <td>SAGAMU 132KV TS</td>
                  <td>{this.checkConnection2(this.state.sagamu.server_time)}</td>
                  <td>{sagamu.mw}</td>
                  <td>{sagamu.kv}</td>
                </tr>
                <tr></tr>
                <tr>
                  <td></td>
                  <td>TOTAL OFF-TAKE</td>
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

export default withRouter(Bilateral);
