import React from "react";
import { withRouter } from 'react-router-dom';
import socket from "./utility/socketIO";
import get_stations from "./stations_adder";

 class PageOne extends React.Component {
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
      connected: false,
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
    const stations_array = get_stations(this.state);
    const omoku_gs = stations_array['OMOKU (GAS)'];
    const riversipp_gs = stations_array['RIVERS IPP (GAS)'];
    const geregugas_gs = stations_array['GEREGU (GAS)'];
    const omotosogas_gs = stations_array['OMOTOSHO (GAS)'];
    const sapelenipp_gs = stations_array['SAPELE NIPP (GAS)'];
    const afam6_gs = stations_array['AFAM VI (GAS/STEAM)'];
    const delta_gs = stations_array['DELTA (GAS)'];
    const paras_gs = stations_array['PARAS ENERGY (GAS)'];
    const omotosonipp_gs = stations_array['OMOTOSHO NIPP (GAS)'];
    const geregunipp_gs = stations_array['GEREGU NIPP (GAS)'];
    const azura_gs = stations_array['AZURA-EDO IPP (GAS)'];
    const transamadi_gs = stations_array['TRANS-AMADI (GAS)'];
    const ibom_gs = stations_array['IBOM POWER (GAS)'];
    const gbarain_gs = stations_array['GBARAIN NIPP (GAS)'];
    const dadinkowa_gs = stations_array['DADINKOWA G.S (HYDRO)'];

    // const totalGeneration = Number(riversipp_gs.mw) + Number(afam6_gs.mw) + Number(paras_gs.mw) + Number(geregugas_gs.mw) +
    // Number(geregunipp_gs.mw) + Number(omotosogas_gs.mw) + Number(omotosonipp_gs.mw) + Number(sapelenipp_gs.mw) + Number(sapelesteam_gs.mw) +
    // Number(omoku_gs.mw) + Number(odukpani_gs.mw) + Number(alaoji_gs.mw) + Number(azura_gs.mw) + Number(olorunsogonipp_gs.mw) + Number(ihovbor_gs.mw) +
    // Number(transamadi_gs.mw) + Number(ibom_gs.mw) + Number(olorunsogogas_gs.mw) + Number(gbarain_gs.mw) + Number(shiroro_gs.mw) + Number(afam4_gs.mw) +
    // Number(kainji_gs.mw) + Number(egbin_gs.mw) + Number(okpai_gs.mw) + Number(delta_gs.mw) + Number(jebba_gs.mw) + Number(dadinkowa_gs.mw);
        
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
                {/* <tr>
                  <td></td>
                  <td>TOTAL GENERATION</td>
                  <td></td>
                  <td>{totalGeneration.toFixed(2)}</td>
                  <td></td>
                </tr>               */}
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

export default withRouter(PageOne);
