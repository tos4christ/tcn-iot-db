import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import get_stations from "./stations_adder";

 class FullPage extends React.Component {
   constructor(props) {
     super(props);
     this.state = { 
      frequency: "",
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
      connected: false,
     };
   }
   componentDidMount() {
    if(this.props.history.location.pathname === "/nccnasfullpage") {
      socket.on("client_message_111", data => {
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
      socket.on("client_message_222", data => {
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
   checkConnection2(time) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if (time === undefined || time === null) {
      return disconnected
    }
    if (time.length === 0) {
        return disconnected
    } else if (time.length > 0) {
        return connected
    }
   }
   checkConnection3(t1, t2) {
    const connected = <span className="text-success"> CN </span>
    const disconnected = <span className="text-danger"> NC </span>
    if (t1 === undefined || t1 === null || t2 === undefined || t2 === null) {
      return disconnected
    }
    if (t1.length > 0 || t2.length > 0) {
        return connected
    } else {
      return disconnected;
    }
   }
  render() {
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
    const phMain_ts = stations_array['PORT-HARCOURT MAIN'];
    const transamadi_gs = stations_array['TRANS-AMADI (GAS)'];
    const ibom_gs = stations_array['IBOM POWER (GAS)'];
    const gbarain_gs = stations_array['GBARAIN NIPP (GAS)'];
    const olorunsogogas_gs = stations_array['OLORUNSOGO (GAS)'];
    const dadinkowa_gs = stations_array['DADINKOWA G.S (HYDRO)'];
    const zungeru_gs = stations_array['ZUNGERU'];
    const taopex_gs = stations_array['TAOPEX'];

    const totalGeneration = Number(riversipp_gs.mw) + Number(afam6_gs.mw) + Number(paras_gs.mw) + Number(geregugas_gs.mw) + 
    Number(geregunipp_gs.mw) + Number(omotosogas_gs.mw) + Number(omotosonipp_gs.mw) + Number(sapelenipp_gs.mw) + Number(sapelesteam_gs.mw) +
    Number(omoku_gs.mw) + Number(odukpani_gs.mw) + Number(alaoji_gs.mw) + Number(azura_gs.mw) + Number(zungeru_gs.mw) + Number(taopex_gs.mw) +
    (Number(olorunsogonipp_gs.mw) <= -3 ? 0 : Number(olorunsogonipp_gs.mw)) + Number(ihovbor_gs.mw) + Number(phMain_ts.mw) +
    Number(ibom_gs.mw) + Number(olorunsogogas_gs.mw) + Number(gbarain_gs.mw) + Number(shiroro_gs.mw) + Number(afam4_gs.mw) + 
    Number(kainji_gs.mw) + Number(egbin_gs.mw) + Number(okpai_gs.mw) + Number(delta_gs.mw) + Number(jebba_gs.mw) + Number(dadinkowa_gs.mw);
        
    return (
      <>
      <div className="ncc-menu">
        <div className="ncc-menu-list">
          <div className="ncc-display-div">
            <h2 className="text-danger">IoT POWER STATIONS TABLE  -- Frequency:  { this.state.frequency }Hz</h2>
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
                <tr>
                  <td>1</td>
                  <td>RIVERS IPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.riversIppPs.t)}</td>
                  <td>{riversipp_gs.mw}</td>
                  <td>{riversipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>AFAM VI (GAS/STEAM)</td>
                  <td>{this.checkConnection2(this.state.afamViTs.t)}</td>
                  <td>{afam6_gs.mw}</td>
                  <td>{afam6_gs.kv}</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>GEREGU (GAS)</td>
                  <td>{this.checkConnection2(this.state.gereguPs.t)}</td>
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
                  <td>{this.checkConnection2(this.state.omotoshoNippPs.t)}</td>
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
                  <td>{this.checkConnection2(this.state.sapeleNippPs.t)}</td>
                  <td>{sapelenipp_gs.mw}</td>
                  <td>{sapelenipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>OMOKU (GAS)</td>
                  <td>{this.checkConnection2(this.state.omokuPs1.t)}</td>
                  <td>{omoku_gs.mw}</td>
                  <td>{omoku_gs.kv}</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>AZURA-EDO IPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.ihovborNippPs.t)}</td>
                  <td>{azura_gs.mw}</td>
                  <td>{azura_gs.kv}</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>TRANS-AMADI (GAS)</td>
                  <td>{this.checkConnection2(this.state.phMain.t)}</td>
                  <td>{phMain_ts.mw}</td>
                  <td>{phMain_ts.kv}</td>
                </tr>
                <tr>
                  <td>11</td>
                  <td>GEREGU NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.gereguPs.t)}</td>
                  <td>{geregunipp_gs.mw}</td>
                  <td>{geregunipp_gs.kv}</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>GBARAIN NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.gbarain.t)}</td>
                  <td>{gbarain_gs.mw}</td>
                  <td>{gbarain_gs.kv}</td>
                </tr>
                <tr>
                  <td>13</td>
                  <td>DADINKOWA G.S (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.dadinKowaGs.t)}</td>
                  <td>{dadinkowa_gs.mw}</td>
                  <td>{dadinkowa_gs.kv}</td>
                </tr>
                <tr>
                  <td>14</td>
                  <td>PARAS ENERGY (GAS)</td>
                  <td>{this.checkConnection2(this.state.parasEnergyPs.t)}</td>
                  <td>{paras_gs.mw}</td>
                  <td>{paras_gs.kv}</td>
                </tr>
                <tr>
                  <td>15</td>
                  <td>IBOM POWER (GAS)</td>
                  <td>{this.checkConnection3(this.state.eket.t, this.state.ekim.t)}</td>
                  <td>{ibom_gs.mw}</td>
                  <td>{ibom_gs.kv}</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>JEBBA (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.jebbaTs.t)}</td>
                  <td>{jebba_gs.mw}</td>
                  <td>{jebba_gs.kv}</td>
                </tr>
                <tr>
                  <td>17</td>
                  <td>OLORUNSOGO (GAS)</td>
                  <td>{this.checkConnection3(this.state.olorunsogo1.t, this.state.olorunsogoPhase1Gs.t)}</td>
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
                  <td>{this.checkConnection2(this.state.sapeleNippPs.t)}</td>
                  <td>{sapelesteam_gs.mw}</td>
                  <td>{sapelesteam_gs.kv}</td>
                </tr>
                <tr>
                  <td>20</td>
                  <td>ODUKPANI NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.odukpaniNippPs.t)}</td>
                  <td>{odukpani_gs.mw}</td>
                  <td>{odukpani_gs.kv}</td>
                </tr>
                <tr>
                  <td>21</td>
                  <td>ALAOJI NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.alaoji.t)}</td>
                  <td>{alaoji_gs.mw}</td>
                  <td>{alaoji_gs.kv}</td>
                </tr>
                <tr>
                  <td>22</td>
                  <td>IHOVBOR NIPP (GAS)</td>
                  <td>{this.checkConnection2(this.state.ihovborNippPs.t)}</td>
                  <td>{ihovbor_gs.mw}</td>
                  <td>{ihovbor_gs.kv}</td>
                </tr>
                <tr>
                  <td>23</td>
                  <td>SHIRORO (HYDRO)</td>
                  <td>{this.checkConnection2(this.state.shiroroPs.t)}</td>
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
                  <td>{this.checkConnection2(this.state.kainjiTs.t)}</td>
                  <td>{kainji_gs.mw}</td>
                  <td>{kainji_gs.kv}</td>
                </tr>
                <tr>
                  <td>26</td>
                  <td>EGBIN (STEAM)</td>
                  <td>{this.checkConnection2(this.state.egbinPs.t)}</td>
                  <td>{egbin_gs.mw}</td>
                  <td>{egbin_gs.kv}</td>
                </tr>
                <tr>
                  <td>27</td>
                  <td>OKPAI (GAS/STEAM)</td>
                  <td>{this.checkConnection2(this.state.okpaiGs.t)}</td>
                  <td>{okpai_gs.mw}</td>
                  <td>{okpai_gs.kv}</td>
                </tr>
                <tr>
                  <td>28</td>
                  <td>ZUNGERU G.S</td>
                  <td>{this.checkConnection2(this.state.zungeru.t)}</td>
                  <td>{zungeru_gs.mw}</td>
                  <td>{zungeru_gs.kv}</td>
                </tr>
                <tr>
                  <td>29</td>
                  <td>TAOPEX G.S</td>
                  <td>{this.checkConnection2(this.state.taopex.t)}</td>
                  <td>{taopex_gs.mw}</td>
                  <td>{taopex_gs.kv}</td>
                </tr>
                <tr></tr>
                <tr>
                  <td></td>
                  <td>TOTAL GENERATION</td>
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
      </div>
    </>
    )         
  }
}

export default withRouter(FullPage);
