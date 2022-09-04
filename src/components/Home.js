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
   }
   toggleDisplay(e) {
    this.setState(prevState => {
      prevState.display = this.state.display === '' ? 'none' : '';
      return {display : prevState.display}
    })
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
            <h2 className="text-danger">IoT POWER STATIONS TABLE</h2>
            <table className="tg">
              <thead>
                <tr>
                  <th className="tg-zb4j">S/N</th>
                  <th className="tg-zb4j">STATIONS</th>
                  <th className="tg-zb4j">STATUS</th>
                  <th className="tg-zb4j">POWER(MW)</th>
                  <th className="tg-zb4j text-danger"><span className="text-danger">VOLTAGE(KV) </span></th>
                </tr>
              </thead>
            <tbody>
              <tr>
                <th>1</th>
                <th>RIVERS IPP (GAS)</th>
                <th>CN</th>
                <th>{riversipp_gs.mw}</th>
                <th>{riversipp_gs.kv}</th>
              </tr>
              <tr>
                <th>2</th>
                <th>AFAM VI (GAS/STEAM)</th>
                <th>CN</th>
                <th>{afam6_gs.mw}</th>
                <th>{afam6_gs.kv}</th>
              </tr>
              <tr>
                <th>3</th>
                <th>GEREGU (GAS)</th>
                <th>CN</th>
                <th>{geregugas_gs.mw}</th>
                <th>{geregugas_gs.kv}</th>
              </tr>
              <tr>
                <th>4</th>
                <th>OMOTOSHO (GAS)</th>
                <th>CN</th>
                <th>{omotosogas_gs.mw}</th>
                <th>{omotosogas_gs.kv}</th>
              </tr>
              <tr>
                <th>5</th>
                <th>OMOTOSHO NIPP (GAS)</th>
                <th>CN</th>
                <th>{omotosonipp_gs.mw}</th>
                <th>{omotosonipp_gs.kv}</th>
              </tr>
              <tr>
                <th>6</th>
                <th>DELTA (GAS)</th>
                <th>CN</th>
                <th>{delta_gs.mw}</th>
                <th>{delta_gs.kv}</th>
              </tr>
              <tr>
                <th>7</th>
                <th>SAPELE NIPP (GAS)</th>
                <th>CN</th>
                <th>{sapelenipp_gs.mw}</th>
                <th>{sapelenipp_gs.kv}</th>
              </tr>
              <tr>
                <th>8</th>
                <th>OMOKU (GAS)</th>
                <th>CN</th>
                <th>{omoku_gs.mw}</th>
                <th>{omoku_gs.kv}</th>
              </tr>
              <tr>
                <th>9</th>
                <th>AZURA-EDO IPP (GAS)</th>
                <th>CN</th>
                <th>{azura_gs.mw}</th>
                <th>{azura_gs.kv}</th>
              </tr>
              <tr>
                <th>10</th>
                <th>TRANS-AMADI (GAS)</th>
                <th>CN</th>
                <th>{transamadi_gs.mw}</th>
                <th>{transamadi_gs.kv}</th>
              </tr>
              <tr className="">
                <th>11</th>
                <th>GEREGU NIPP (GAS)</th>
                <th>CN</th>
                <th>{geregunipp_gs.mw}</th>
                <th>{geregunipp_gs.kv}</th>
              </tr>
              <tr className="" >
                <th>12</th>
                <th>GBARAIN NIPP (GAS)</th>
                <th>CN</th>
                <th>{gbarain_gs.mw}</th>
                <th>{gbarain_gs.kv}</th>
              </tr>
              <tr className="">
                <th>13</th>
                <th>DADINKOWA G.S (HYDRO)</th>
                <th>CN</th>
                <th>{dadinkowa_gs.mw}</th>
                <th>{dadinkowa_gs.kv}</th>
              </tr>
              <tr className="">
                <th>14</th>
                <th>PARAS ENERGY (GAS)</th>
                <th>CN</th>
                <th>{paras_gs.mw}</th>
                <th>{paras_gs.kv}</th>
              </tr>
              <tr className="">
                <th>15</th>
                <th>IBOM POWER (GAS)</th>
                <th>CN</th>
                <th>{ibom_gs.mw}</th>
                <th>{ibom_gs.kv}</th>
              </tr>
              <tr className="">
                <th>16</th>
                <th>JEBBA (HYDRO)</th>
                <th>CN</th>
                <th>{jebba_gs.mw}</th>
                <th>{jebba_gs.kv}</th>
              </tr>
              <tr className="">
                <th>17</th>
                <th>OLORUNSOGO (GAS)</th>
                <th>CN</th>
                <th>{olorunsogogas_gs.mw}</th>
                <th>{olorunsogogas_gs.kv}</th>
              </tr>
              <tr className="">
                <th>18</th>
                <th>OLORUNSOGO NIPP</th>
                <th>CN</th>
                <th>{olorunsogonipp_gs.mw}</th>
                <th>{olorunsogonipp_gs.kv}</th>
              </tr>
              <tr className="">
                <th>19</th>
                <th>SAPELE (STEAM)</th>
                <th>CN</th>
                <th>{sapelesteam_gs.mw}</th>
                <th>{sapelesteam_gs.kv}</th>
              </tr>
              <tr>
                <th>20</th>
                <th>ODUKPANI NIPP (GAS)</th>
                <th>CN</th>
                <th>{odukpani_gs.mw}</th>
                <th>{odukpani_gs.kv}</th>
              </tr>
              <tr>
                <th>21</th>
                <th>ALAOJI NIPP (GAS)</th>
                <th>CN</th>
                <th>{alaoji_gs.mw}</th>
                <th>{alaoji_gs.kv}</th>
              </tr>
              <tr className="">
                <th>22</th>
                <th>IHOVBOR NIPP (GAS)</th>
                <th>CN</th>
                <th>{ihovbor_gs.mw}</th>
                <th>{ihovbor_gs.kv}</th>
              </tr>
              <tr className="">
                <th>23</th>
                <th>SHIRORO (HYDRO)</th>
                <th>CN</th>
                <th>{shiroro_gs.mw}</th>
                <th>{shiroro_gs.kv}</th>
              </tr>
              <tr className="">
                <th>24</th>
                <th>{'AFAM IV & V (GAS)'}</th>
                <th>CN</th>
                <th>{afam4_gs.mw}</th>
                <th>{afam4_gs.kv}</th>
              </tr>
              <tr className="">
                <th>25</th>
                <th>KAINJI (HYDRO)</th>
                <th>CN</th>
                <th>{kainji_gs.mw}</th>
                <th>{kainji_gs.kv}</th>
              </tr>
              <tr className="">
                <th>26</th>
                <th>EGBIN (STEAM)</th>
                <th>CN</th>
                <th>{egbin_gs.mw}</th>
                <th>{egbin_gs.kv}</th>
              </tr>
              <tr className="">
                <th>27</th>
                <th>OKPAI (GAS/STEAM)</th>
                <th>CN</th>
                <th>{okpai_gs.mw}</th>
                <th>{okpai_gs.kv}</th>
              </tr>
              <tr></tr>
              <tr >
                <th></th>
                <th>TOTAL</th>
                <th></th>
                <th>{totalGeneration.toFixed(2)}</th>
                <th></th>
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
                  <th className="tg-zb4j">VOLTAGE</th>
                </tr>
              </thead>
                <tbody>
                  <tr>
                    <th>101</th>
                    <th>IKOT EKPENE TS</th>
                    <th>CN</th>
                    <th>{ikotekpene_ts.mw}</th>
                    <th>{ikotekpene_ts.kv}</th>
                  </tr>
                  <tr>
                    <th>102</th>
                    <th>GWAGWALADA TS</th>
                    <th>CN</th>
                    <th>{gwagwalada_ts.mw}</th>
                    <th>{gwagwalada_ts.kv}</th>
                  </tr>
                  <tr>
                    <th>103</th>
                    <th>LOKOJA TS</th>
                    <th>CN</th>
                    <th>{lokoja_ts.mw}</th>
                    <th>{lokoja_ts.kv}</th>
                  </tr>
                  <tr className="">
                    <th>104</th>
                    <th>ASABA TS</th>
                    <th>CN</th>
                    <th>{asaba_ts.mw}</th>
                    <th>{asaba_ts.kv}</th>
                  </tr>
                  <tr className="">
                    <th>105</th>
                    <th>UGWAJI TS</th>
                    <th>CN</th>
                    <th>{ugwuaji_ts.mw}</th>
                    <th>{ugwuaji_ts.kv}</th>
                  </tr>
                  <tr>
                    <th>107</th>
                    <th>EKIM TS</th>
                    <th>CN</th>
                    <th>{ekim_ts.mw}</th>
                    <th>{ekim_ts.kv}</th>
                  </tr>
                  <tr>
                    <th>108</th>
                    <th>PORTHARCOURT MAIN TS</th>
                    <th>CN</th>
                    <th>{phMain_ts.mw}</th>
                    <th>{phMain_ts.kv}</th>
                  </tr>
                  <tr>
                    <th>109</th>
                    <th>EKET TS</th>
                    <th>CN</th>
                    <th>{eket_ts.mw}</th>
                    <th>{eket_ts.kv}</th>
                  </tr>              
                  <tr>
                    <th></th>
                    <th>TOTAL</th>
                    <th></th>
                    <th>{totalTransmission.toFixed(2)}</th>
                    <th></th>
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
