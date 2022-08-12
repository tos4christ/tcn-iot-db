import React from "react";
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import { Spinner, Button, Table } from "react-bootstrap";
import Downtime from './Downtime';
import History from './History';
import Profile from './Profile';
import Uptime from './Uptime';
import Average from './Average';
import localStorage from "local-storage";


 class Home extends React.Component {
   constructor(props) {
     super(props);
     this.streamReadings = this.streamReadings.bind(this);
     this.state = {
       "OMOTOSHO NIPP": {},
       "TRANS AMADI": {},
       "AZURA": {},
       "GEREGU NIPP": {},
       "PARAS ENERGY": {},
       "ASABA": {},
       "UGWUAJI": {},
       "DELTA 2": {},
       "OLORUNSOGO NIPP": {},
       "IHOVBOR NIPP": {},
       "OMOKU GS": {},
       "GWAGWALADA": {},
       "RIVERS IPP": {},
       "IKOT EKPENE": {},
       "GEREGU GAS": {},
       "EKIM": {},
       "DELTA 3": {},
       "OMOTOSHO GAS" : {},
       "ODUKPANI GS": {},
       "SAPELE STEAM": {},
       "SAPELE NIPP": {},
       "LOKOJA TS": {},
       "ALAOJI": {},
       "AFAM VI": {},
       "PORT-HARCOURT MAIN": {},
       "EKET": {},
       "OMOTOSHO 2": {},
       "OLORUNSOGO GAS": {},
       "GBARAIN": {},
       message: "",
       received: [],
       connected: false,
     }
   }
   componentDidMount() {
     this.streamInterval = setInterval(() => this.streamReadings(), 3000);
     this.streamReadings();
   }
   componentWillUnmount() {
     clearInterval(this.streamInterval)
   }
  //  toggleDisplay(e) {
  //   this.setState(prevState => {
  //     prevState.display = this.state.display === '' ? 'none' : '';
  //     return {display : prevState.display}
  //   })
  //  }
   streamReadings() {
     const url = 'lines/all';
     const token = localStorage.getItem("token");
    fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token
      }
    })
    .then(response => response.json())
    .then( res => {
      const data = res.res;
      // console.log(data, 'the stream data')
      this.setState(prevState => {
        const returnObject = {};
        if(data && data.length > 0) {
          data.forEach(element => {
            if(element.mw !== null) {
              prevState[element.station] = element
              returnObject[element.station] = prevState[element.station]
            }            
          });
        }
        return returnObject;
      });
    })
    .catch(e => console.log(e));
   }
  render() {
    // console.log(this.state)
    const riversIppPs = this.state["RIVERS IPP"].mw ? this.state["RIVERS IPP"].mw.toFixed(2) : 0;
    const afamViTs = this.state["AFAM VI"].mw ? this.state["AFAM VI"].mw.toFixed(2) : 0;
    const parasEnergyPs = this.state["PARAS ENERGY"].mw ? this.state["PARAS ENERGY"].mw.toFixed(2) : 0;
    const gereguNipp = this.state["GEREGU NIPP"].mw ? this.state["GEREGU NIPP"].mw.toFixed(2) : 0;
    const gereguGas = this.state["GEREGU GAS"].mw ? this.state["GEREGU GAS"].mw.toFixed(2) : 0;
    const omotosho2 = this.state["OMOTOSHO 2"].mw ? this.state["OMOTOSHO 2"].mw.toFixed(2) : 0;
    const omotosho1 = this.state["OMOTOSHO GAS"].mw ? this.state["OMOTOSHO GAS"].mw.toFixed(2) : 0;
    const omotoshoNippPs = this.state["OMOTOSHO NIPP"].mw ? this.state["OMOTOSHO NIPP"].mw.toFixed(2) : 0;
    const delta3 = this.state["DELTA 3"].mw ? this.state["DELTA 3"].mw.toFixed(2) : 0;
    const sapeleNippPs = this.state["SAPELE NIPP"].mw ? this.state["SAPELE NIPP"].mw.toFixed(2) : 0;
    const sapeleSteam = this.state["SAPELE STEAM"].mw ? this.state["SAPELE STEAM"].mw.toFixed(2) : 0;
    const omokuPs1 = this.state["OMOKU GS"].mw ? this.state["OMOKU GS"].mw.toFixed(2) : 0;
    const odukpaniGs = this.state["ODUKPANI GS"].mw ? this.state["ODUKPANI GS"].mw.toFixed(2) : 0;
    const ikotEkpene = this.state["IKOT EKPENE"].mw ? this.state["IKOT EKPENE"].mw.toFixed(2) : 0;
    const alaoji = this.state.ALAOJI.mw ? this.state.ALAOJI.mw.toFixed(2) : 0;
    const ekim = this.state.EKIM.mw ? this.state.EKIM.mw.toFixed(2) : 0;
    const gwagwalada = this.state.GWAGWALADA.mw ? this.state.GWAGWALADA.mw.toFixed(2) : 0;
    const lokojaTs = this.state["LOKOJA TS"].mw ? this.state["LOKOJA TS"].mw.toFixed(2) : 0;
    const phMain = this.state["PORT-HARCOURT MAIN"].mw ? this.state["PORT-HARCOURT MAIN"].mw.toFixed(2) : 0;
    const eket = this.state.EKET.mw ? this.state.EKET.mw.toFixed(2) : 0;
    const azura = this.state.AZURA.mw ? this.state.AZURA.mw.toFixed(2) : 0;
    const delta2 = this.state["DELTA 2"].mw ? this.state["DELTA 2"].mw.toFixed(2) : 0;
    const olorunsogo1 = this.state["OLORUNSOGO NIPP"].mw ? this.state["OLORUNSOGO NIPP"].mw.toFixed(2) : 0;
    const ugwuaji = this.state.UGWUAJI.mw ? this.state.UGWUAJI.mw.toFixed(2) : 0;
    const asaba = this.state.ASABA.mw ? this.state.ASABA.mw.toFixed(2) : 0;
    const ihovborNippPs = this.state["IHOVBOR NIPP"].mw ? this.state["IHOVBOR NIPP"].mw.toFixed(2) : 0;
    const transAmadi = this.state["TRANS AMADI"].mw ? this.state["TRANS AMADI"].mw.toFixed(2) : 0;
    const ibomPs = (ekim ? Number(ekim) : 0) + (eket ? Number(eket) : 0);
    const olorunsogo2 = this.state["OLORUNSOGO GAS"].mw ? this.state["OLORUNSOGO GAS"].mw.toFixed(2) : 0;
    const gbarain = this.state.GBARAIN.mw ? this.state.GBARAIN.mw.toFixed(2) : 0;

    const totalGeneration = Number(olorunsogo1) + Number(olorunsogo2) + Number(gbarain) + Number(ibomPs) + Number(parasEnergyPs) + Number(delta2) 
    + Number(azura) + Number(transAmadi) + Number(riversIppPs) + Number(afamViTs) + Number(gereguGas) 
    + Number(gereguNipp) + Number(alaoji) + Number(odukpaniGs) + Number(omotosho2) + Number(omotosho1) 
    + Number(omotoshoNippPs) + Number(delta3) + Number(sapeleNippPs) + Number(sapeleSteam) + Number(omokuPs1)
     + Number(ihovborNippPs);

    const totalTransmission = Number(asaba) + Number(ugwuaji) + Number(eket) + Number(phMain) + Number(lokojaTs)
     + Number(gwagwalada) + Number(ekim) + Number(ikotEkpene);
    return (
      <div className="menu">
        <div className="text-white rounded">
          <span className="message">TCN Tool to query equipment parameters and state</span>
        </div>
        <div className="menu-list">
          <ul className="ul-menu text-center">
            <li>
              <Link to={'/downtime'} onClick={this.toggleDisplay} type="button">Downtime</Link>
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
                <th>RIVERS IPP</th>
                <th>CN</th>
                <th>{this.state["RIVERS IPP"].mw ? this.state["RIVERS IPP"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["RIVERS IPP"].kv ? this.state["RIVERS IPP"].kv : 0 }</th>
              </tr>
              <tr>
                <th>2</th>
                <th>AFAM VI</th>
                <th>CN</th>
                <th>{this.state["AFAM VI"].mw ? this.state["AFAM VI"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["AFAM VI"].kv ? this.state["AFAM VI"].kv : 0 }</th>
              </tr>
              <tr>
                <th>3</th>
                <th>GEREGU GAS</th>
                <th>CN</th>
                <th>{this.state["GEREGU GAS"].mw ? this.state["GEREGU GAS"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["GEREGU GAS"].kv ? this.state["GEREGU GAS"].kv : 0 }</th>
              </tr>
              <tr>
                <th>4</th>
                <th>OMOTOSHO GAS</th>
                <th>CN</th>
                <th>{this.state["OMOTOSHO GAS"].mw ? this.state["OMOTOSHO GAS"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["OMOTOSHO GAS"].kv ? this.state["OMOTOSHO GAS"].kv : 0 }</th>
              </tr>
              <tr>
                <th>5</th>
                <th>OMOTOSHO NIPP</th>
                <th>CN</th>
                <th>{this.state["OMOTOSHO NIPP"].mw ? this.state["OMOTOSHO NIPP"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["OMOTOSHO NIPP"].kv ? this.state["OMOTOSHO NIPP"].kv : 0 }</th>
              </tr>
              <tr>
                <th>6</th>
                <th>DELTA-3</th>
                <th>CN</th>
                <th>{this.state["DELTA 3"].mw ? this.state["DELTA 3"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["DELTA 3"].kv ? this.state["DELTA 3"].kv : 0 }</th>
              </tr>
              <tr>
                <th>7</th>
                <th>SAPELE NIPP</th>
                <th>CN</th>
                <th>{this.state["SAPELE NIPP"].mw ? this.state["SAPELE NIPP"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["SAPELE NIPP"].kv ? this.state["SAPELE NIPP"].kv : 0 }</th>
              </tr>
              <tr>
                <th>8</th>
                <th>OMOKU</th>
                <th>CN</th>
                <th>{this.state["OMOKU GS"].mw ? this.state["OMOKU GS"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["OMOKU GS"].kv ? this.state["OMOKU GS"].kv : 0 }</th>
              </tr>
              <tr>
                <th>9</th>
                <th>AZURA</th>
                <th>CN</th>
                <th>{this.state.AZURA.mw ? this.state.AZURA.mw.toFixed(2) : 0 }</th>
                <th>{this.state.AZURA.kv ? this.state.AZURA.kv : 0 }</th>
              </tr>
              <tr>
                <th>10</th>
                <th>TRANS AMADI</th>
                <th>CN</th>
                <th>{this.state["TRANS AMADI"].mw ? this.state["TRANS AMADI"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["TRANS AMADI"].kv ? this.state["TRANS AMADI"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>11</th>
                <th>GEREGU NIPP</th>
                <th>CN</th>
                <th>{this.state["GEREGU NIPP"].mw ? this.state["GEREGU NIPP"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["GEREGU NIPP"].kv ? this.state["GEREGU NIPP"].kv : 0 }</th>
              </tr>
              <tr className="" >
                <th>12</th>
                <th>GBARAIN</th>
                <th>CN</th>
                <th>{this.state.GBARAIN.mw ? this.state.GBARAIN.mw.toFixed(2) : 0 }</th>
                <th>{this.state.GBARAIN.kv ? this.state.GBARAIN.kv : 0 }</th>
              </tr>
              <tr className="">
                <th>13</th>
                <th>DADI-KOWA HYDRO</th>
                <th>PNDG</th>
                <th>0</th>
                <th>---</th>
              </tr>
              <tr className="">
                <th>14</th>
                <th>PARAS ENERGY</th>
                <th>CN</th>
                <th>{this.state["PARAS ENERGY"].mw ? this.state["PARAS ENERGY"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["PARAS ENERGY"].kv ? this.state["PARAS ENERGY"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>15</th>
                <th>IBOM POWER</th>
                <th>CN</th>
                <th>{Number(ibomPs).toFixed(2)}</th>
                <th>{this.state.EKIM.kv ? this.state.EKIM.kv : this.state.EKET.kv ? this.state.EKET.kv : 0 }</th>
              </tr>
              <tr className="">
                <th>16</th>
                <th>DELTA-2</th>
                <th>CN</th>
                <th>{this.state["DELTA 2"].mw ? this.state["DELTA 2"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["DELTA 2"].kv ? this.state["DELTA 2"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>17</th>
                <th>OLORUNSOGO GAS</th>
                <th>CN</th>
                <th>{this.state["OLORUNSOGO GAS"].mw ? this.state["OLORUNSOGO GAS"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["OLORUNSOGO GAS"].kv ? this.state["OLORUNSOGO GAS"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>18</th>
                <th>OLORUNSOGO NIPP</th>
                <th>CN</th>
                <th>{this.state["OLORUNSOGO NIPP"].mw ? this.state["OLORUNSOGO NIPP"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["OLORUNSOGO NIPP"].kv ? this.state["OLORUNSOGO NIPP"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>19</th>
                <th>SAPELE STEAM</th>
                <th>CN</th>
                <th>{this.state["SAPELE STEAM"].mw ? this.state["SAPELE STEAM"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["SAPELE STEAM"].kv ? this.state["SAPELE STEAM"].kv : 0 }</th>
              </tr>
              <tr>
              <th>20</th>
                <th>ODUKPANI</th>
                <th>CN</th>
                <th>{this.state["ODUKPANI GS"].mw ? this.state["ODUKPANI GS"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["ODUKPANI GS"].kv ? this.state["ODUKPANI GS"].kv : 0 }</th>
              </tr>
              <tr>
                <th>21</th>
                <th>ALAOJI NIPP</th>
                <th>CN</th>
                <th>{this.state.ALAOJI.mw ? this.state.ALAOJI.mw.toFixed(2) : 0 }</th>
                <th>{this.state.ALAOJI.kv ? this.state.ALAOJI.kv : 0 }</th>
              </tr>
              <tr className="">
                <th>22</th>
                <th>IHOVBOR NIPPS</th>
                <th>CN</th>
                <th>{this.state["IHOVBOR NIPP"].mw ? this.state["IHOVBOR NIPP"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["IHOVBOR NIPP"].kv ? this.state["IHOVBOR NIPP"].kv : 0 }</th>
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
                <th>{this.state["IKOT EKPENE"].mw ? this.state["IKOT EKPENE"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["IKOT EKPENE"].kv ? this.state["IKOT EKPENE"].kv : 0 }</th>
              </tr>
              <tr>
                <th>102</th>
                <th>GWAGWALADA TS</th>
                <th>CN</th>
                <th>{this.state.GWAGWALADA.mw ? this.state.GWAGWALADA.mw.toFixed(2) : 0 }</th>
                <th>{this.state.GWAGWALADA.kv ? this.state.GWAGWALADA.kv : 0 }</th>
              </tr>
              <tr>
                <th>103</th>
                <th>LOKOJA TS</th>
                <th>CN</th>
                <th>{this.state["LOKOJA TS"].mw ? this.state["LOKOJA TS"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["LOKOJA TS"].kv ? this.state["LOKOJA TS"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>104</th>
                <th>ASABA</th>
                <th>CN</th>
                <th>{this.state.ASABA.mw ? this.state.ASABA.mw.toFixed(2) : 0 }</th>
                <th>{this.state.ASABA.kv ? this.state.ASABA.kv : 0 }</th>
              </tr>
              <tr className="">
                <th>105</th>
                <th>UGWAJI</th>
                <th>CN</th>
                <th>{this.state.UGWUAJI.mw ? this.state.UGWUAJI.mw.toFixed(2) : 0 }</th>
                <th>{this.state.UGWUAJI.kv ? this.state.UGWUAJI.kv : 0 }</th>
              </tr>
              <tr className="">
                <th>106</th>
                <th>MAKURDI</th>
                <th>CN</th>
                <th>{this.state.UGWUAJI.mw ? this.state.UGWUAJI.mw.toFixed(2) : 0 }</th>
                <th>{this.state.UGWUAJI.kv ? this.state.UGWUAJI.kv : 0 }</th>
              </tr>
              <tr>
                <th>107</th>
                <th>EKIM TS</th>
                <th>CN</th>
                <th>{this.state.EKIM.mw ? this.state.EKIM.mw.toFixed(2) : 0 }</th>
                <th>{this.state.EKIM.kv ? this.state.EKIM.kv : 0 }</th>
              </tr>
              <tr>
                <th>108</th>
                <th>PORTHARCOURT MAIN TS</th>
                <th>CN</th>
                <th>{this.state["PORT-HARCOURT MAIN"].mw ? this.state["PORT-HARCOURT MAIN"].mw.toFixed(2) : 0 }</th>
                <th>{this.state["PORT-HARCOURT MAIN"].kv ? this.state["PORT-HARCOURT MAIN"].kv : 0 }</th>
              </tr>
              <tr>
                <th>109</th>
                <th>EKET TS</th>
                <th>CN</th>
                <th>{this.state.EKET.mw ? this.state.EKET.mw.toFixed(2) : 0 }</th>
                <th>{this.state.EKET.kv ? this.state.EKET.kv : 0 }</th>
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
        </div>
        <Switch>
          <Route path={`/downtime`}> <Downtime /> </Route>
          <Route path={`/uptime`}> <Uptime /> </Route>
          <Route path={`/history`}> <History /> </Route>
          <Route path={`/profile`}> <Profile /> </Route>
          <Route path={`/average`}> <Average /> </Route>
        </Switch>        
      </div>
    )         
  }
}

export default withRouter(Home);
