import React from "react";
import { Link, withRouter, Redirect } from 'react-router-dom';
import socket from "./utility/socketIO";
import get_stations from "./stations_adder";
import DateTime from "./DateTime";

// import { Spinner, Button, Table } from "react-bootstrap";

 class Home extends React.Component {
   constructor(props) {
     super(props);
     this.toggleDisplay = this.toggleDisplay.bind(this);
     this.state = { 
      frequency: "",
      afamIv_vPs: {},
      afamVPs: {},
      transamadiGs: {},
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
      message: "",
      received: [],
      connected: false,
      display: ''
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/home") {
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
   toggleDisplay(e) {
    this.setState(prevState => {
      prevState.display = this.state.display === '' ? 'none' : '';
      return {display : prevState.display}
    })
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
      const time_diff_2 = (time_now - t1) > 30000;
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
  render() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to={'/'}/>
    }
    const stations_array = get_stations(this.state);
    const olorunsogonipp_gs = stations_array['OLORUNSOGO NIPP'];
    const zungeru_gs = stations_array['ZUNGERU'];
    const taopex_gs = stations_array['TAOPEX'];
    const ihovbor_gs = stations_array['IHOVBOR NIPP (GAS)'];
    const omoku_gs = stations_array['OMOKU (GAS)'];
    const riversipp_gs = stations_array['RIVERS IPP (GAS)'];
    const geregugas_gs = stations_array['GEREGU (GAS)'];
    const omotosogas_gs = stations_array['OMOTOSHO (GAS)'];
    const odukpani_gs = stations_array['ODUKPANI NIPP (GAS)'];
    const sapelenipp_gs = stations_array['SAPELE NIPP (GAS)'];
    const sapelesteam_gs = stations_array['SAPELE (STEAM)'];
    const alaoji_gs = stations_array['ALAOJI NIPP (GAS)'];
    const afam6_gs = stations_array['AFAM VI (GAS/STEAM)'];
    const jebba_gs = stations_array['JEBBA (HYDRO)'];
    const delta_gs = stations_array['DELTA (GAS)'];
    const okpai_gs = stations_array['OKPAI (GAS/STEAM)'];
    const egbin_gs = stations_array['EGBIN (STEAM)'];
    const kainji_gs = stations_array['KAINJI (HYDRO)'];
    const afam4_gs = stations_array['AFAM IV & V (GAS)'];
    const shiroro_gs = stations_array['SHIRORO (HYDRO)'];
    const paras_gs = stations_array['PARAS ENERGY (GAS)'];
    const omotosonipp_gs = stations_array['OMOTOSHO NIPP (GAS)'];
    const geregunipp_gs = stations_array['GEREGU NIPP (GAS)'];
    const azura_gs = stations_array['AZURA-EDO IPP (GAS)'];
    const transamadi_gs = stations_array['TRANS-AMADI (GAS)'];
    const ibom_gs = stations_array['IBOM POWER (GAS)'];
    const gbarain_gs = stations_array['GBARAIN NIPP (GAS)'];
    const olorunsogogas_gs = stations_array['OLORUNSOGO (GAS)'];
    const dadinkowa_gs = stations_array['DADINKOWA G.S (HYDRO)'];
    const asaba_ts = stations_array['ASABA'];
    const ugwuaji_ts = stations_array['UGWUAJI'];
    const gwagwalada_ts = stations_array['GWAGWALADA'];
    const ikotekpene_ts = stations_array['IKOT EKPENE'];
    const ekim_ts = stations_array['EKIM'];    
    const phMain_ts = stations_array['PORT-HARCOURT MAIN'];
    const lokoja_ts = stations_array['LOKOJA TS'];
    const eket_ts = stations_array['EKET'];

    const totalGeneration = (Number(riversipp_gs.mw) < 0 ? 0 : Number(riversipp_gs.mw))+ 
    (Number(afam6_gs.mw) < 0 ? 0 : Number(afam6_gs.mw))+ 
    (Number(paras_gs.mw) < 0 ? 0 : Number(paras_gs.mw))+ 
    (Number(geregugas_gs.mw) < 0 ? 0 : Number(geregugas_gs.mw))+ 
    (Number(zungeru_gs.mw) < 0 ? 0 : Number(zungeru_gs.mw))+
    (Number(geregunipp_gs.mw) < 0 ? 0 : Number(geregunipp_gs.mw))+ 
    (Number(omotosogas_gs.mw) < 0 ? 0 : Number(omotosogas_gs.mw))+ 
    (Number(omotosonipp_gs.mw) < 0 ? 0 : Number(omotosonipp_gs.mw))+ 
    (Number(sapelenipp_gs.mw) < 0 ? 0 : Number(sapelenipp_gs.mw))+ 
    (Number(sapelesteam_gs.mw) < 0 ? 0 : Number(sapelesteam_gs.mw))+
    (Number(omoku_gs.mw) < 0 ? 0 : Number(omoku_gs.mw))+ 
    (Number(odukpani_gs.mw) < 0 ? 0 : Number(odukpani_gs.mw))+ 
    (Number(alaoji_gs.mw) < 0 ? 0 : Number(alaoji_gs.mw))+ 
    (Number(azura_gs.mw) < 0 ? 0 : Number(azura_gs.mw))+ 
    (Number(olorunsogonipp_gs.mw) < 0 ? 0 : Number(olorunsogonipp_gs.mw))+ 
    (Number(ihovbor_gs.mw) < 0 ? 0 : Number(ihovbor_gs.mw))+
    (Number(phMain_ts.mw) < 0 ? 0 : Number(phMain_ts.mw))+ 
    (Number(ibom_gs.mw) < 0 ? 0 : Number(ibom_gs.mw))+ 
    (Number(olorunsogogas_gs.mw) < 0 ? 0 : Number(olorunsogogas_gs.mw))+ 
    (Number(gbarain_gs.mw) < 0 ? 0 : Number(gbarain_gs.mw))+ 
    (Number(shiroro_gs.mw) < 0 ? 0 : Number(shiroro_gs.mw))+ 
    (Number(afam4_gs.mw) < 0 ? 0 : Number(afam4_gs.mw))+
    (Number(kainji_gs.mw) < 0 ? 0 : Number(kainji_gs.mw))+ 
    (Number(egbin_gs.mw) < 0 ? 0 : Number(egbin_gs.mw))+ 
    (Number(okpai_gs.mw) < 0 ? 0 : Number(okpai_gs.mw))+ 
    (Number(delta_gs.mw) < 0 ? 0 : Number(delta_gs.mw))+ 
    (Number(jebba_gs.mw) < 0 ? 0 : Number(jebba_gs.mw))+ 
    (Number(dadinkowa_gs.mw) < 0 ? 0 : Number(dadinkowa_gs.mw))+
    (Number(taopex_gs.mw) < 0 ? 0 : Number(taopex_gs.mw));
    
    const totalTransmission = (Number(ugwuaji_ts.mw) < 0 ? 0 : Number(ugwuaji_ts.mw))+ 
    (Number(asaba_ts.mw) < 0 ? 0 : Number(asaba_ts.mw))+ 
    (Number(ekim_ts.mw) < 0 ? 0 : Number(ekim_ts.mw))+ 
    (Number(gwagwalada_ts.mw) < 0 ? 0 : Number(gwagwalada_ts.mw))+ 
    (Number(lokoja_ts.mw) < 0 ? 0 : Number(lokoja_ts.mw))+
    (Number(phMain_ts.mw) < 0 ? 0 : Number(phMain_ts.mw))+ 
    (Number(ikotekpene_ts.mw) < 0 ? 0 : Number(ikotekpene_ts.mw))+ 
    (Number(eket_ts.mw) < 0 ? 0 : Number(eket_ts.mw));
        
    return (
      <>
      <div className="menu">
        <div className="text-white rounded">
          <h2 className="message">TCN Tool to query equipment parameters and state</h2>
        </div>
        <div className="menu-list">
          <ul className="ul-menu text-center">
            <li>
              <Link to={`/collapse`} onClick={this.toggleDisplay} type="button">Analyze Generation</Link>
            </li>
            <li>
              <Link to={`/tem`} onClick={this.toggleDisplay} type="button">TEM Sheet Download</Link>
            </li>
            <li>
              <Link to={`/downtime`} onClick={this.toggleDisplay} type="button">Downtime</Link>
            </li>
            <li>
              <Link to={'/uptime'} onClick={this.toggleDisplay} type="button">Uptime</Link>
            </li>
            <li>
              <Link to={'/history'} onClick={this.toggleDisplay} type="button">History</Link>
            </li>
            <li>
              <Link to={'/profile'} onClick={this.toggleDisplay} type="button">Profile</Link>
            </li>
            <li>
              <Link to={'/average'} onClick={this.toggleDisplay} type="button">Average</Link>
            </li>
            <li>
              <Link to={'/updatepassword'} onClick={this.toggleDisplay} type="button">Change Password</Link>
            </li>
          </ul>
          <div className="display-div">
            <h2 className="pb-0 mb-0"> <DateTime /></h2>
            <h1 className="text-danger pt-0 mt-0"> Frequency:  { this.state.frequency } Hz</h1>
            <h2 className="text-danger">IoT POWER STATIONS TABLE</h2>
            <table className="tg">
              <thead>
                <tr>
                  <th className="tg-zb4j">S/N</th>
                  <th className="tg-zb4j">STATIONS</th>
                  <th className="tg-zb4j">STATUS</th>
                  <th className="tg-zb4j">POWER(MW)</th>
                  <th className="tg-zb4j text-danger">VOLTAGE(kV)</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                  <td>1</td>
                  <td>RIVERS IPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.riversIppPs.server_time)}</td>
                  <td>{riversipp_gs.mw}</td>
                  <td>{riversipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>AFAM VI (GAS/STEAM)</td>
                  <td>{this.checkConnection2(this.state.afamViTs.server_time)}</td>
                  <td>{afam6_gs.mw}</td>
                  <td>{afam6_gs.kv}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>GEREGU (GAS)</td>
                  <td>{this.checkConnection2(this.state.gereguPs.server_time)}</td>
                  <td>{geregugas_gs.mw}</td>
                  <td>{geregugas_gs.kv}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>OMOTOSHO (GAS)</td>
                  <td>{this.checkConnection3(this.state.omotosho2.server_time, this.state.omotosho1.server_time)}</td>
                  <td>{omotosogas_gs.mw}</td>
                  <td>{omotosogas_gs.kv}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>OMOTOSHO NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.omotoshoNippPs.server_time)}</td>
                  <td>{omotosonipp_gs.mw}</td>
                  <td>{omotosonipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>DELTA (GAS)</td>
                  <td>{this.checkConnection4(this.state.delta2.server_time, this.state.delta3.server_time, this.state.deltaGs.server_time)}</td>
                  <td>{delta_gs.mw}</td>
                  <td>{delta_gs.kv}</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>SAPELE NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.sapeleNippPs.server_time)}</td>
                  <td>{sapelenipp_gs.mw}</td>
                  <td>{sapelenipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>OMOKU (GAS)</td>
                  <td>{this.checkConnection2(this.state.omokuPs1.server_time)}</td>
                  <td>{omoku_gs.mw}</td>
                  <td>{omoku_gs.kv}</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>AZURA-EDO IPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.ihovborNippPs.server_time)}</td>
                  <td>{azura_gs.mw}</td>
                  <td>{azura_gs.kv}</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>TRANS-AMADI (GAS)</td>
                  <td>{this.checkConnection2(this.state.phMain.server_time)}</td>
                  <td>{phMain_ts.mw}</td>
                  <td>{phMain_ts.kv}</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>GEREGU NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.gereguPs.server_time)}</td>
                  <td>{geregunipp_gs.mw}</td>
                  <td>{geregunipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>GBARAIN NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.gbarain.server_time)}</td>
                  <td>{gbarain_gs.mw}</td>
                  <td>{gbarain_gs.kv}</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>DADINKOWA G.S (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.dadinKowaGs.server_time)}</td>
                  <td>{dadinkowa_gs.mw}</td>
                  <td>{dadinkowa_gs.kv}</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>PARAS ENERGY (GAS)</td>
                  <td>{this.checkConnection2(this.state.parasEnergyPs.server_time)}</td>
                  <td>{paras_gs.mw}</td>
                  <td>{paras_gs.kv}</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>IBOM POWER (GAS)</td>
                  <td>{this.checkConnection2(this.state.eket.server_time)}</td>
                  <td>{ibom_gs.mw}</td>
                  <td>{ibom_gs.kv}</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>JEBBA (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.jebbaTs.server_time)}</td>
                  <td>{jebba_gs.mw}</td>
                  <td>{jebba_gs.kv}</td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>OLORUNSOGO (GAS)</td>
                  <td>{this.checkConnection3(this.state.olorunsogo1.server_time, this.state.olorunsogoPhase1Gs.server_time)}</td>
                  <td>{olorunsogogas_gs.mw}</td>
                  <td>{olorunsogogas_gs.kv}</td>
                </tr>
                <tr>
                  <td>18</td>
                  <td>OLORUNSOGO NIPP</td>
                  <td>{this.checkConnection3(this.state.olorunsogo1.server_time, this.state.olorunsogoPhase1Gs.server_time)}</td>
                  <td>{Number(olorunsogonipp_gs.mw) <= -3 ? 0 : Number(olorunsogonipp_gs.mw)}</td>
                  <td>{olorunsogonipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>19</td>
                  <td>SAPELE (STEAM)</td>
                  <td>{this.checkConnection2(this.state.sapeleNippPs.server_time)}</td>
                  <td>{sapelesteam_gs.mw}</td>
                  <td>{sapelesteam_gs.kv}</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>ODUKPANI NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.odukpaniNippPs.server_time)}</td>
                  <td>{odukpani_gs.mw}</td>
                  <td>{odukpani_gs.kv}</td>
                </tr>
                <tr>
                  <td>21</td>
                  <td>ALAOJI NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.alaoji.server_time)}</td>
                  <td>{alaoji_gs.mw}</td>
                  <td>{alaoji_gs.kv}</td>
                </tr>
                <tr>
                  <td>22</td>
                  <td>IHOVBOR NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.ihovborNippPs.server_time)}</td>
                  <td>{ihovbor_gs.mw}</td>
                  <td>{ihovbor_gs.kv}</td>
                </tr>
                <tr>
                  <td>23</td>
                  <td>SHIRORO (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.shiroroPs.server_time)}</td>
                  <td>{shiroro_gs.mw}</td>
                  <td>{shiroro_gs.kv}</td>
                </tr>
                <tr>
                  <td>24</td>
                  <td>{'AFAM IV & V (GAS)'}</td>
                  <td>{this.checkConnection3(this.state.afamVPs.server_time, this.state.afamIv_vPs.server_time)}</td>
                  <td>{afam4_gs.mw}</td>
                  <td>{afam4_gs.kv}</td>
                </tr>
                <tr>
                  <td>25</td>
                  <td>KAINJI (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.kainjiTs.server_time)}</td>
                  <td>{kainji_gs.mw}</td>
                  <td>{kainji_gs.kv}</td>
                </tr>
                <tr>
                  <td>26</td>
                  <td>EGBIN (STEAM)</td>
                  <td>{this.checkConnection2(this.state.egbinPs.server_time)}</td>
                  <td>{egbin_gs.mw}</td>
                  <td>{egbin_gs.kv}</td>
                </tr>
                <tr>
                  <td>27</td>
                  <td>OKPAI (GAS/STEAM)</td>
                  <td>{this.checkConnection2(this.state.okpaiGs.server_time)}</td>
                  <td>{okpai_gs.mw}</td>
                  <td>{okpai_gs.kv}</td>
                </tr>
                <tr>
                  <td>28</td>
                  <td>ZUNGERU G.S</td>
                  <td>{this.checkConnection2(this.state.zungeru.server_time)}</td>
                  <td>{zungeru_gs.mw}</td>
                  <td>{zungeru_gs.kv}</td>
                </tr>
                <tr>
                  <td>29</td>
                  <td>TAOPEX G.S</td>
                  <td>{this.checkConnection2(this.state.taopex.server_time)}</td>
                  <td>{taopex_gs.mw}</td>
                  <td>{taopex_gs.kv}</td>
                </tr>
                <tr></tr>
                <tr >
                  <td></td>
                  <td>TOTAL</td>
                  <td></td>
                  <td>{totalGeneration.toFixed(2)}</td>
                  <td></td>
                </tr>              
              </tbody>
            </table>

            <h2 className="text-white">IoT Transmission Stations</h2>
            <table className="tg">
              <thead>
                <tr>
                  <th className="tg-zb4j">S/N</th>
                  <th className="tg-zb4j">STATIONS</th>
                  <th className="tg-zb4j">STATUS</th>
                  <th className="tg-zb4j">POWER(MW)</th>
                  <th className="tg-zb4j">VOLTAGE(kV)</th>
                </tr>
              </thead>
                <tbody>
                  <tr>
                    <td>101</td>
                    <td>IKOT EKPENE TS</td>
                    <td>{this.checkConnection2(this.state.ikotEkpene.server_time)}</td>
                    <td>{ikotekpene_ts.mw}</td>
                    <td>{ikotekpene_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>102</td>
                    <td>GWAGWALADA TS</td>
                    <td>{this.checkConnection2(this.state.gwagwalada.server_time)}</td>
                    <td>{gwagwalada_ts.mw}</td>
                    <td>{gwagwalada_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>103</td>
                    <td>LOKOJA TS</td>
                    <td>{this.checkConnection2(this.state.lokojaTs.server_time)}</td>
                    <td>{lokoja_ts.mw}</td>
                    <td>{lokoja_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>104</td>
                    <td>ASABA TS</td>
                    <td>{this.checkConnection2(this.state.asaba.server_time)}</td>
                    <td>{asaba_ts.mw}</td>
                    <td>{asaba_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>105</td>
                    <td>UGWAJI TS</td>
                    <td>{this.checkConnection2(this.state.ugwuaji.server_time)}</td>
                    <td>{ugwuaji_ts.mw}</td>
                    <td>{ugwuaji_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>107</td>
                    <td>EKIM TS</td>
                    <td>{this.checkConnection2(this.state.ekim.server_time)}</td>
                    <td>{ekim_ts.mw}</td>
                    <td>{ekim_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>108</td>
                    <td>PORTHARCOURT MAIN TS</td>
                    <td>{this.checkConnection2(this.state.phMain.server_time)}</td>
                    <td>{phMain_ts.mw}</td>
                    <td>{phMain_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>109</td>
                    <td>EKET TS</td>
                    <td>{this.checkConnection2(this.state.eket.server_time)}</td>
                    <td>{eket_ts.mw}</td>
                    <td>{eket_ts.kv}</td>
                  </tr>              
                  <tr>
                    <td></td>
                    <td>TOTAL</td>
                    <td></td>
                    <td>{totalTransmission.toFixed(2)}</td>
                    <td></td>
                  </tr>
              </tbody>
            </table>
          </div>
          <div className="counter-div">

          </div>
        </div>              
      </div>
    </>
    )         
  }
}

export default withRouter(Home);
