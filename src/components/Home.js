import React from "react";
import { Link, withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Spinner, Button, Table } from "react-bootstrap";



 class Home extends React.Component {
   constructor(props) {
     super(props);
     this.streamReadings = this.streamReadings.bind(this);
     this.toggleDisplay = this.toggleDisplay.bind(this);
     this.state = { 
      'EKET': {},
      'PORT-HARCOURT MAIN' : {},
      'LOKOJA TS' : {},
      'EKIM' : {},
      'IKOT EKPENE' : {}, 
      'GWAGWALADA' : {},
      'UGWUAJI' : {},
      'ASABA' : {},
      'SHIRORO (HYDRO)' : {},
      'AFAM IV & V (GAS)' : {},
      'KAINJI (HYDRO)' : {},
      'EGBIN (STEAM)' : {},
      'OKPAI (GAS/STEAM)' : {},
      'DELTA (GAS)' : {},
      'JEBBA (HYDRO)' : {},
      'AFAM VI (GAS/STEAM)' : {},
      'ALAOJI NIPP (GAS)' : {},
      'SAPELE (STEAM)' : {},
      'SAPELE NIPP (GAS)' : {},
      'ODUKPANI NIPP (GAS)' : {},
      'OMOTOSHO (GAS)' : {},
      'GEREGU (GAS)' : {},
      'RIVERS IPP (GAS)' : {},
      'OMOKU (GAS)' : {},
      'IHOVBOR NIPP (GAS)' : {},
      'OLORUNSOGO NIPP' : {},
      'PARAS ENERGY (GAS)' : {},
      'OMOTOSHO NIPP (GAS)' : {},
      'GEREGU NIPP (GAS)' : {},
      'AZURA-EDO IPP (GAS)' : {},
      'TRANS-AMADI (GAS)' : {},
      'IBOM POWER (GAS)' : {},
      'GBARAIN NIPP (GAS)' : {},
      'OLORUNSOGO (GAS)' : {},
      'DADINKOWA G.S (HYDRO)' : {},
      message: "",
      received: [],
      connected: false,
      display: ''
  };
   }
   componentDidMount() {
     this.streamInterval = setInterval(() => this.streamReadings(), 3000);
     this.streamReadings();
   }
   componentWillUnmount() {
     clearInterval(this.streamInterval)
   }
   toggleDisplay(e) {
    this.setState(prevState => {
      prevState.display = this.state.display === '' ? 'none' : '';
      return {display : prevState.display}
    })
   }
   streamReadings() {
     const url = 'lines/all';
     const token = localStorage.getItem("token");
     // console.log(token, 'this is the token');
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        credentials: 'include'
      },    
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
    const { isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return <Redirect to={'/'}/>
    }
    const riversIppPs = this.state["RIVERS IPP (GAS)"].mw ? this.state["RIVERS IPP (GAS)"].mw.toFixed(2) : 0;
    const afamViTs = this.state["AFAM VI (GAS/STEAM)"].mw ? this.state["AFAM VI (GAS/STEAM)"].mw.toFixed(2) : 0;
    const parasEnergyPs = this.state["PARAS ENERGY (GAS)"].mw ? this.state["PARAS ENERGY (GAS)"].mw.toFixed(2) : 0;
    const gereguNipp = this.state["GEREGU NIPP (GAS)"].mw ? this.state["GEREGU NIPP (GAS)"].mw.toFixed(2) : 0;
    const gereguGas = this.state["GEREGU (GAS)"].mw ? this.state["GEREGU (GAS)"].mw.toFixed(2) : 0;
    const omotoshoGas = this.state["OMOTOSHO (GAS)"].mw ? this.state["OMOTOSHO (GAS)"].mw.toFixed(2) : 0;
    const omotoshoNippPs = this.state["OMOTOSHO NIPP (GAS)"].mw ? this.state["OMOTOSHO NIPP (GAS)"].mw.toFixed(2) : 0;
    const sapeleNippPs = this.state["SAPELE NIPP (GAS)"].mw ? this.state["SAPELE NIPP (GAS)"].mw.toFixed(2) : 0;
    const sapeleSteam = this.state["SAPELE (STEAM)"].mw ? this.state["SAPELE (STEAM)"].mw.toFixed(2) : 0;
    const omokuPs1 = this.state["OMOKU (GAS)"].mw ? this.state["OMOKU (GAS)"].mw.toFixed(2) : 0;
    const odukpaniGs = this.state["ODUKPANI NIPP (GAS)"].mw ? this.state["ODUKPANI NIPP (GAS)"].mw.toFixed(2) : 0;
    const alaoji = this.state["ALAOJI NIPP (GAS)"].mw ? this.state["ALAOJI NIPP (GAS)"].mw.toFixed(2) : 0;
    const azura = this.state["AZURA-EDO IPP (GAS)"].mw ? this.state["AZURA-EDO IPP (GAS)"].mw.toFixed(2) : 0;
    const olorunsogoNipp = this.state["OLORUNSOGO NIPP"].mw ? this.state["OLORUNSOGO NIPP"].mw.toFixed(2) : 0;
    const ihovborNippPs = this.state["IHOVBOR NIPP (GAS)"].mw ? this.state["IHOVBOR NIPP (GAS)"].mw.toFixed(2) : 0;
    const transAmadi = this.state["TRANS-AMADI (GAS)"].mw ? this.state["TRANS-AMADI (GAS)"].mw.toFixed(2) : 0;
    const ibomPs = this.state["IBOM POWER (GAS)"].mw ? this.state["IBOM POWER (GAS)"].mw.toFixed(2) : 0;
    const olorunsogoGas = this.state["OLORUNSOGO (GAS)"].mw ? this.state["OLORUNSOGO (GAS)"].mw.toFixed(2) : 0;
    const gbarain = this.state["GBARAIN NIPP (GAS)"].mw ? this.state["GBARAIN NIPP (GAS)"].mw.toFixed(2) : 0;
    const shiroro = this.state["SHIRORO (HYDRO)"].mw ? this.state["SHIRORO (HYDRO)"].mw.toFixed(2) : 0;
    const afam45 = this.state["AFAM IV & V (GAS)"].mw ? this.state["AFAM IV & V (GAS)"].mw.toFixed(2) : 0;
    const kainji = this.state["KAINJI (HYDRO)"].mw ? this.state["KAINJI (HYDRO)"].mw.toFixed(2) : 0;
    const egbin = this.state["EGBIN (STEAM)"].mw ? this.state["EGBIN (STEAM)"].mw.toFixed(2) : 0;
    const okpai = this.state["OKPAI (GAS/STEAM)"].mw ? this.state["OKPAI (GAS/STEAM)"].mw.toFixed(2) : 0;
    const delta = this.state["DELTA (GAS)"].mw ? this.state["DELTA (GAS)"].mw.toFixed(2) : 0;
    const jebba = this.state["JEBBA (HYDRO)"].mw ? this.state["JEBBA (HYDRO)"].mw.toFixed(2) : 0;
    const dadinkowa = this.state["DADINKOWA G.S (HYDRO)"].mw ? this.state["DADINKOWA G.S (HYDRO)"].mw.toFixed(2) : 0;
    const ugwuajiTs = this.state.UGWUAJI.mw ? this.state.UGWUAJI.mw.toFixed(2) : 0;
    const asabaTs = this.state.ASABA.mw ? this.state.ASABA.mw.toFixed(2) : 0;
    const ekimTs = this.state.EKIM.mw ? this.state.EKIM.mw.toFixed(2) : 0;
    const gwagwaladaTs = this.state.GWAGWALADA.mw ? this.state.GWAGWALADA.mw.toFixed(2) : 0;
    const lokojaTs = this.state["LOKOJA TS"].mw ? this.state["LOKOJA TS"].mw.toFixed(2) : 0;
    const phMainTs = this.state["PORT-HARCOURT MAIN"].mw ? this.state["PORT-HARCOURT MAIN"].mw.toFixed(2) : 0;
    const ikotEkpeneTs = this.state["IKOT EKPENE"].mw ? this.state["IKOT EKPENE"].mw.toFixed(2) : 0;
    const eketTs = this.state.EKET.mw ? this.state.EKET.mw.toFixed(2) : 0;

    const totalGeneration = Number(riversIppPs) + Number(afamViTs) + Number(parasEnergyPs) + Number(gereguGas) +
    Number(gereguNipp) + Number(omotoshoGas) + Number(omotoshoNippPs) + Number(sapeleNippPs) + Number(sapeleSteam) +
    Number(omokuPs1) + Number(odukpaniGs) + Number(alaoji) + Number(azura) + Number(olorunsogoNipp) + Number(ihovborNippPs) +
    Number(transAmadi) + Number(ibomPs) + Number(olorunsogoGas) + Number(gbarain) + Number(shiroro) + Number(afam45) +
    Number(kainji) + Number(egbin) + Number(okpai) + Number(delta) + Number(jebba) + Number(dadinkowa);
    
    const totalTransmission = Number(ugwuajiTs) + Number(asabaTs) + Number(ekimTs) + Number(gwagwaladaTs) + Number(lokojaTs) +
    Number(phMainTs) + Number(ikotEkpeneTs) + Number(eketTs);
        
    return (
      <>
      <div className="menu">
        <div className="text-white rounded">
          <span className="message">TCN Tool to query equipment parameters and state</span>
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
                <th>{Number(riversIppPs).toFixed(2)}</th>
                <th>{this.state["RIVERS IPP (GAS)"].kv ? this.state["RIVERS IPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>2</th>
                <th>AFAM VI (GAS/STEAM)</th>
                <th>CN</th>
                <th>{Number(afamViTs).toFixed(2)}</th>
                <th>{this.state["AFAM VI (GAS/STEAM)"].kv ? this.state["AFAM VI (GAS/STEAM)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>3</th>
                <th>GEREGU (GAS)</th>
                <th>CN</th>
                <th>{Number(gereguGas).toFixed(2)}</th>
                <th>{this.state["GEREGU (GAS)"].kv ? this.state["GEREGU (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>4</th>
                <th>OMOTOSHO (GAS)</th>
                <th>CN</th>
                <th>{Number(omotoshoGas).toFixed(2)}</th>
                <th>{this.state["OMOTOSHO (GAS)"].kv ? this.state["OMOTOSHO (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>5</th>
                <th>OMOTOSHO NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(omotoshoNippPs).toFixed(2)}</th>
                <th>{this.state["OMOTOSHO NIPP (GAS)"].kv ? this.state["OMOTOSHO NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>6</th>
                <th>DELTA (GAS)</th>
                <th>CN</th>
                <th>{Number(delta).toFixed(2)}</th>
                <th>{this.state["DELTA (GAS)"].kv ? this.state["DELTA (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>7</th>
                <th>SAPELE NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(sapeleNippPs).toFixed(2)}</th>
                <th>{this.state["SAPELE NIPP (GAS)"].kv ? this.state["SAPELE NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>8</th>
                <th>OMOKU (GAS)</th>
                <th>CN</th>
                <th>{Number(omokuPs1).toFixed(2)}</th>
                <th>{this.state["OMOKU (GAS)"].kv ? this.state["OMOKU (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>9</th>
                <th>AZURA-EDO IPP (GAS)</th>
                <th>CN</th>
                <th>{Number(azura).toFixed(2)}</th>
                <th>{this.state["AZURA-EDO IPP (GAS)"].kv ? this.state["AZURA-EDO IPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>10</th>
                <th>TRANS-AMADI (GAS)</th>
                <th>CN</th>
                <th>{Number(transAmadi).toFixed(2)}</th>
                <th>{this.state["TRANS-AMADI (GAS)"].kv ? this.state["TRANS-AMADI (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>11</th>
                <th>GEREGU NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(gereguNipp).toFixed(2)}</th>
                <th>{this.state["GEREGU NIPP (GAS)"].kv ? this.state["GEREGU NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="" >
                <th>12</th>
                <th>GBARAIN NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(gbarain).toFixed(2)}</th>
                <th>{this.state["GBARAIN NIPP (GAS)"].kv ? this.state["GBARAIN NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>13</th>
                <th>DADINKOWA G.S (HYDRO)</th>
                <th>CN</th>
                <th>{Number(dadinkowa).toFixed(2)}</th>
                <th>{this.state["DADINKOWA G.S (HYDRO)"].kv ? this.state["DADINKOWA G.S (HYDRO)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>14</th>
                <th>PARAS ENERGY (GAS)</th>
                <th>CN</th>
                <th>{Number(parasEnergyPs).toFixed(2)}</th>
                <th>{this.state["PARAS ENERGY (GAS)"].kv ? this.state["PARAS ENERGY (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>15</th>
                <th>IBOM POWER (GAS)</th>
                <th>CN</th>
                <th>{Number(ibomPs).toFixed(2)}</th>
                <th>{this.state["IBOM POWER (GAS)"].kv ? this.state["IBOM POWER (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>16</th>
                <th>JEBBA (HYDRO)</th>
                <th>CN</th>
                <th>{Number(jebba).toFixed(2)}</th>
                <th>{this.state["JEBBA (HYDRO)"].kv ? this.state["JEBBA (HYDRO)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>17</th>
                <th>OLORUNSOGO (GAS)</th>
                <th>CN</th>
                <th>{Number(olorunsogoGas).toFixed(2)}</th>
                <th>{this.state["OLORUNSOGO (GAS)"].kv ? this.state["OLORUNSOGO (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>18</th>
                <th>OLORUNSOGO NIPP</th>
                <th>CN</th>
                <th>{Number(olorunsogoNipp).toFixed(2)}</th>
                <th>{this.state["OLORUNSOGO NIPP"].kv ? this.state["OLORUNSOGO NIPP"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>19</th>
                <th>SAPELE (STEAM)</th>
                <th>CN</th>
                <th>{Number(sapeleSteam).toFixed(2)}</th>
                <th>{this.state["SAPELE (STEAM)"].kv ? this.state["SAPELE (STEAM)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>20</th>
                <th>ODUKPANI NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(odukpaniGs).toFixed(2)}</th>
                <th>{this.state["ODUKPANI NIPP (GAS)"].kv ? this.state["ODUKPANI NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr>
                <th>21</th>
                <th>ALAOJI NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(alaoji).toFixed(2)}</th>
                <th>{this.state["ALAOJI NIPP (GAS)"].kv ? this.state["ALAOJI NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>22</th>
                <th>IHOVBOR NIPP (GAS)</th>
                <th>CN</th>
                <th>{Number(ihovborNippPs).toFixed(2)}</th>
                <th>{this.state["IHOVBOR NIPP (GAS)"].kv ? this.state["IHOVBOR NIPP (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>23</th>
                <th>SHIRORO (HYDRO)</th>
                <th>CN</th>
                <th>{Number(shiroro).toFixed(2)}</th>
                <th>{this.state["SHIRORO (HYDRO)"].kv ? this.state["SHIRORO (HYDRO)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>24</th>
                <th>{'AFAM IV & V (GAS)'}</th>
                <th>CN</th>
                <th>{Number(afam45).toFixed(2)}</th>
                <th>{this.state["AFAM IV & V (GAS)"].kv ? this.state["AFAM IV & V (GAS)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>25</th>
                <th>KAINJI (HYDRO)</th>
                <th>CN</th>
                <th>{Number(kainji).toFixed(2)}</th>
                <th>{this.state["KAINJI (HYDRO)"].kv ? this.state["KAINJI (HYDRO)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>26</th>
                <th>EGBIN (STEAM)</th>
                <th>CN</th>
                <th>{Number(egbin).toFixed(2)}</th>
                <th>{this.state["EGBIN (STEAM)"].kv ? this.state["EGBIN (STEAM)"].kv : 0 }</th>
              </tr>
              <tr className="">
                <th>27</th>
                <th>OKPAI (GAS/STEAM)</th>
                <th>CN</th>
                <th>{Number(okpai).toFixed(2)}</th>
                <th>{this.state["OKPAI (GAS/STEAM)"].kv ? this.state["OKPAI (GAS/STEAM)"].kv : 0 }</th>
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
                  <th>{Number(ikotEkpeneTs).toFixed(2)}</th>
                  <th>{this.state["IKOT EKPENE"].kv ? this.state["IKOT EKPENE"].kv : 0 }</th>
                </tr>
                <tr>
                  <th>102</th>
                  <th>GWAGWALADA TS</th>
                  <th>CN</th>
                  <th>{Number(gwagwaladaTs).toFixed(2)}</th>
                  <th>{this.state.GWAGWALADA.kv ? this.state.GWAGWALADA.kv : 0 }</th>
                </tr>
                <tr>
                  <th>103</th>
                  <th>LOKOJA TS</th>
                  <th>CN</th>
                  <th>{Number(lokojaTs).toFixed(2)}</th>
                  <th>{this.state["LOKOJA TS"].kv ? this.state["LOKOJA TS"].kv : 0 }</th>
                </tr>
                <tr className="">
                  <th>104</th>
                  <th>ASABA TS</th>
                  <th>CN</th>
                  <th>{Number(asabaTs).toFixed(2)}</th>
                  <th>{this.state.ASABA.kv ? this.state.ASABA.kv : 0 }</th>
                </tr>
                <tr className="">
                  <th>105</th>
                  <th>UGWAJI TS</th>
                  <th>CN</th>
                  <th>{Number(ugwuajiTs).toFixed(2)}</th>
                  <th>{this.state.UGWUAJI.kv ? this.state.UGWUAJI.kv : 0 }</th>
                </tr>
                <tr>
                  <th>107</th>
                  <th>EKIM TS</th>
                  <th>CN</th>
                  <th>{Number(ekimTs).toFixed(2)}</th>
                  <th>{this.state.EKIM.kv ? this.state.EKIM.kv : 0 }</th>
                </tr>
                <tr>
                  <th>108</th>
                  <th>PORTHARCOURT MAIN TS</th>
                  <th>CN</th>
                  <th>{Number(phMainTs).toFixed(2)}</th>
                  <th>{this.state["PORT-HARCOURT MAIN"].kv ? this.state["PORT-HARCOURT MAIN"].kv : 0 }</th>
                </tr>
                <tr>
                  <th>109</th>
                  <th>EKET TS</th>
                  <th>CN</th>
                  <th>{Number(eketTs).toFixed(2)}</th>
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
      </div>
    </>
    )         
  }
}

export default withRouter(Home);
