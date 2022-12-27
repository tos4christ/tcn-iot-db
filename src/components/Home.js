import React from "react";
import { Link, withRouter, Redirect } from 'react-router-dom';
import socket from "./utility/socketIO";
import get_stations from "./stations_adder";
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
      message: "",
      received: [],
      connected: false,
      display: ''
     };
   }
   componentDidMount() {
    socket.on("client_message_1", data => {
      const { message } = data;
      const parsedMessage = JSON.parse(message);
      const station = parsedMessage.id;
      const returnObject = {}
      // console.log(parsedMessage, 'c1 message');
      this.setState(prevState => {
        prevState[station] = parsedMessage;
        returnObject[station] = prevState[station]
        return returnObject;
      })
    });
    socket.on("client_message_2", data => {
      const { message } = data;
      const parsedMessage = JSON.parse(message);
      const station = parsedMessage.id;
      const returnObject = {}
      // console.log(parsedMessage, 'c2 message');
      this.setState(prevState => {
        prevState[station] = parsedMessage;
        returnObject[station] = prevState[station]
        return returnObject;
      })
    });
    socket.on("frequency", data => {
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
   toggleDisplay(e) {
    this.setState(prevState => {
      prevState.display = this.state.display === '' ? 'none' : '';
      return {display : prevState.display}
    })
   }
   checkConnection(mw, kv) {
    mw = Number(mw);
    kv = Number(kv);
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if (mw === 0 && kv === 0) {
        return disconnected
    } else if (mw !== 0 || kv !== 0) {
        return connected
    } else {
        return disconnected
    }
   }
  render() {
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to={'/'}/>
    }
    const stations_array = get_stations(this.state);
    const olorunsogonipp_gs = stations_array['OLORUNSOGO NIPP'];
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

    const totalGeneration = Number(riversipp_gs.mw) + Number(afam6_gs.mw) + Number(paras_gs.mw) + Number(geregugas_gs.mw) +
    Number(geregunipp_gs.mw) + Number(omotosogas_gs.mw) + Number(omotosonipp_gs.mw) + Number(sapelenipp_gs.mw) + Number(sapelesteam_gs.mw) +
    Number(omoku_gs.mw) + Number(odukpani_gs.mw) + Number(alaoji_gs.mw) + Number(azura_gs.mw) + Number(olorunsogonipp_gs.mw) + Number(ihovbor_gs.mw) +
    Number(transamadi_gs.mw) + Number(ibom_gs.mw) + Number(olorunsogogas_gs.mw) + Number(gbarain_gs.mw) + Number(shiroro_gs.mw) + Number(afam4_gs.mw) +
    Number(kainji_gs.mw) + Number(egbin_gs.mw) + Number(okpai_gs.mw) + Number(delta_gs.mw) + Number(jebba_gs.mw) + Number(dadinkowa_gs.mw);
    
    const totalTransmission = Number(ugwuaji_ts.mw) + Number(asaba_ts.mw) + Number(ekim_ts.mw) + Number(gwagwalada_ts.mw) + Number(lokoja_ts.mw) +
    Number(phMain_ts.mw) + Number(ikotekpene_ts.mw) + Number(eket_ts.mw);
        
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
            <h1 className="text-danger"> Frequency:  { this.state.frequency }</h1>
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
                  <td>{this.checkConnection(riversipp_gs.mw, riversipp_gs.kv)}</td>
                  <td>{riversipp_gs.mw}</td>
                  <td>{riversipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>AFAM VI (GAS/STEAM)</td>
                  <td>{this.checkConnection(afam6_gs.mw, afam6_gs.kv)}</td>
                  <td>{afam6_gs.mw}</td>
                  <td>{afam6_gs.kv}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>GEREGU (GAS)</td>
                  <td>{this.checkConnection(geregugas_gs.mw, geregugas_gs.kv)}</td>
                  <td>{geregugas_gs.mw}</td>
                  <td>{geregugas_gs.kv}</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>OMOTOSHO (GAS)</td>
                  <td>{this.checkConnection(omotosogas_gs.mw, omotosogas_gs.kv)}</td>
                  <td>{omotosogas_gs.mw}</td>
                  <td>{omotosogas_gs.kv}</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>OMOTOSHO NIPP (GAS)</td>
                  <td>{this.checkConnection(omotosonipp_gs.mw, omotosonipp_gs.kv)}</td>
                  <td>{omotosonipp_gs.mw}</td>
                  <td>{omotosonipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>DELTA (GAS)</td>
                  <td>{this.checkConnection(delta_gs.mw, delta_gs.kv)}</td>
                  <td>{delta_gs.mw}</td>
                  <td>{delta_gs.kv}</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>SAPELE NIPP (GAS)</td>
                  <td>{this.checkConnection(sapelenipp_gs.mw, sapelenipp_gs.kv)}</td>
                  <td>{sapelenipp_gs.mw}</td>
                  <td>{sapelenipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>OMOKU (GAS)</td>
                  <td>{this.checkConnection(omoku_gs.mw, omoku_gs.kv)}</td>
                  <td>{omoku_gs.mw}</td>
                  <td>{omoku_gs.kv}</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>AZURA-EDO IPP (GAS)</td>
                  <td>{this.checkConnection(azura_gs.mw, azura_gs.kv)}</td>
                  <td>{azura_gs.mw}</td>
                  <td>{azura_gs.kv}</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>TRANS-AMADI (GAS)</td>
                  <td>{this.checkConnection(transamadi_gs.mw, transamadi_gs.kv)}</td>
                  <td>{transamadi_gs.mw}</td>
                  <td>{transamadi_gs.kv}</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>GEREGU NIPP (GAS)</td>
                  <td>{this.checkConnection(geregunipp_gs.mw, geregunipp_gs.kv)}</td>
                  <td>{geregunipp_gs.mw}</td>
                  <td>{geregunipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>GBARAIN NIPP (GAS)</td>
                  <td>{this.checkConnection(gbarain_gs.mw, gbarain_gs.kv)}</td>
                  <td>{gbarain_gs.mw}</td>
                  <td>{gbarain_gs.kv}</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>DADINKOWA G.S (HYDRO)</td>
                  <td>{this.checkConnection(dadinkowa_gs.mw, dadinkowa_gs.kv)}</td>
                  <td>{dadinkowa_gs.mw}</td>
                  <td>{dadinkowa_gs.kv}</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>PARAS ENERGY (GAS)</td>
                  <td>{this.checkConnection(paras_gs.mw, paras_gs.kv)}</td>
                  <td>{paras_gs.mw}</td>
                  <td>{paras_gs.kv}</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>IBOM POWER (GAS)</td>
                  <td>{this.checkConnection(ibom_gs.mw, ibom_gs.kv)}</td>
                  <td>{ibom_gs.mw}</td>
                  <td>{ibom_gs.kv}</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>JEBBA (HYDRO)</td>
                  <td>{this.checkConnection(jebba_gs.mw, jebba_gs.kv)}</td>
                  <td>{jebba_gs.mw}</td>
                  <td>{jebba_gs.kv}</td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>OLORUNSOGO (GAS)</td>
                  <td>{this.checkConnection(olorunsogogas_gs.mw, olorunsogogas_gs.kv )}</td>
                  <td>{olorunsogogas_gs.mw}</td>
                  <td>{olorunsogogas_gs.kv}</td>
                </tr>
                <tr>
                  <td>18</td>
                  <td>OLORUNSOGO NIPP</td>
                  <td>{this.checkConnection(olorunsogonipp_gs.mw, olorunsogonipp_gs.kv)}</td>
                  <td>{Number(olorunsogonipp_gs.mw) <= -3 ? 0 : Number(olorunsogonipp_gs.mw)}</td>
                  <td>{olorunsogonipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>19</td>
                  <td>SAPELE (STEAM)</td>
                  <td>{this.checkConnection(sapelesteam_gs.mw, sapelesteam_gs.kv)}</td>
                  <td>{sapelesteam_gs.mw}</td>
                  <td>{sapelesteam_gs.kv}</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>ODUKPANI NIPP (GAS)</td>
                  <td>{this.checkConnection(odukpani_gs.mw, odukpani_gs.kv)}</td>
                  <td>{odukpani_gs.mw}</td>
                  <td>{odukpani_gs.kv}</td>
                </tr>
                <tr>
                  <td>21</td>
                  <td>ALAOJI NIPP (GAS)</td>
                  <td>{this.checkConnection(alaoji_gs.mw, alaoji_gs.kv)}</td>
                  <td>{alaoji_gs.mw}</td>
                  <td>{alaoji_gs.kv}</td>
                </tr>
                <tr>
                  <td>22</td>
                  <td>IHOVBOR NIPP (GAS)</td>
                  <td>{this.checkConnection(ihovbor_gs.mw, ihovbor_gs.kv)}</td>
                  <td>{ihovbor_gs.mw}</td>
                  <td>{ihovbor_gs.kv}</td>
                </tr>
                <tr>
                  <td>23</td>
                  <td>SHIRORO (HYDRO)</td>
                  <td>{this.checkConnection(shiroro_gs.mw, shiroro_gs.kv)}</td>
                  <td>{shiroro_gs.mw}</td>
                  <td>{shiroro_gs.kv}</td>
                </tr>
                <tr>
                  <td>24</td>
                  <td>{'AFAM IV & V (GAS)'}</td>
                  <td>{this.checkConnection(afam4_gs.mw, afam4_gs.kv)}</td>
                  <td>{afam4_gs.mw}</td>
                  <td>{afam4_gs.kv}</td>
                </tr>
                <tr>
                  <td>25</td>
                  <td>KAINJI (HYDRO)</td>
                  <td>{this.checkConnection(kainji_gs.mw, kainji_gs.kv)}</td>
                  <td>{kainji_gs.mw}</td>
                  <td>{kainji_gs.kv}</td>
                </tr>
                <tr>
                  <td>26</td>
                  <td>EGBIN (STEAM)</td>
                  <td>{this.checkConnection(egbin_gs.mw, egbin_gs.kv)}</td>
                  <td>{egbin_gs.mw}</td>
                  <td>{egbin_gs.kv}</td>
                </tr>
                <tr>
                  <td>27</td>
                  <td>OKPAI (GAS/STEAM)</td>
                  <td>{this.checkConnection(okpai_gs.mw, okpai_gs.kv)}</td>
                  <td>{okpai_gs.mw}</td>
                  <td>{okpai_gs.kv}</td>
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
                    <td>{this.checkConnection(ikotekpene_ts.mw, ikotekpene_ts.kv)}</td>
                    <td>{ikotekpene_ts.mw}</td>
                    <td>{ikotekpene_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>102</td>
                    <td>GWAGWALADA TS</td>
                    <td>{this.checkConnection(gwagwalada_ts.mw, gwagwalada_ts.kv)}</td>
                    <td>{gwagwalada_ts.mw}</td>
                    <td>{gwagwalada_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>103</td>
                    <td>LOKOJA TS</td>
                    <td>{this.checkConnection(lokoja_ts.mw, lokoja_ts.kv)}</td>
                    <td>{lokoja_ts.mw}</td>
                    <td>{lokoja_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>104</td>
                    <td>ASABA TS</td>
                    <td>{this.checkConnection(asaba_ts.mw, asaba_ts.kv)}</td>
                    <td>{asaba_ts.mw}</td>
                    <td>{asaba_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>105</td>
                    <td>UGWAJI TS</td>
                    <td>{this.checkConnection(ugwuaji_ts.mw, ugwuaji_ts.kv)}</td>
                    <td>{ugwuaji_ts.mw}</td>
                    <td>{ugwuaji_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>107</td>
                    <td>EKIM TS</td>
                    <td>{this.checkConnection(ekim_ts.mw, ekim_ts.kv)}</td>
                    <td>{ekim_ts.mw}</td>
                    <td>{ekim_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>108</td>
                    <td>PORTHARCOURT MAIN TS</td>
                    <td>{this.checkConnection(phMain_ts.mw, phMain_ts.kv)}</td>
                    <td>{phMain_ts.mw}</td>
                    <td>{phMain_ts.kv}</td>
                  </tr>
                  <tr>
                    <td>109</td>
                    <td>EKET TS</td>
                    <td>{this.checkConnection(eket_ts.mw, eket_ts.kv)}</td>
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
