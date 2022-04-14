import React from "react";
import { Link, withRouter, Route, Switch } from 'react-router-dom';
import { Spinner, Button, Table } from "react-bootstrap";
import Downtime from './Downtime';
import History from './History';
import Profile from './Profile';
import Uptime from './Uptime';
import Average from './Average';
import websocketClient from "./utility/socketConnection";
import websocket from "websocket";


 class Home extends React.Component {
   constructor(props) {
     super(props);
     this.streamReadings = this.streamReadings.bind(this);
     this.toggleDisplay = this.toggleDisplay.bind(this);
     this.state = {
       display : this.props.location.pathname.length > 1 ? 'none' : '',
       omotoshoNippPs: {},
       odukpaniGs: {},
       ikotEkpene: {},
       alaoji: {},
       riversIppPs: {},
       ekim: {},
       lokojaTs: {},
       phMain: {},
       omotosho1: {},
       sapeleNippPs: {},
       afamViTs: {},
       omotosho2: {},
       delta3: {},
       eket: {},
       gwagwalada: {},
       gereguPs: {},
       omokuPs1: {},
       ihovborNippPs : {},
       total: 198,
       message: "",
       received: [],
       connected: false,
     }
   }
   componentDidMount() {
     this.streamInterval = setInterval(() => this.streamReadings(), 3000);
     this.streamReadings();
     websocketClient(
      {
        queryParams: {
          favoritePizza: "supreme",
        },
        onMessage: (message) => {
          console.log(message);
          this.setState(({ received }) => {
            return {
              received: [...received, message],
            };
          });
        },
        onDisconnect: () => {
          this.setState({ connected: false });
        },
      },
      (websocketClient) => {
        this.setState({ connected: true }, () => {
          this.websocketClient = websocketClient;
          console.log(websocketClient, 'the client')
        });
      }
    );
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
     const url = '/lines/all';
    fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then( res => {
      const data = res.res;

      this.setState(prevState => {
        const returnObject = {};
        if(data && data.length > 0) {
          data.forEach(element => {
            prevState[element.station] = element
            returnObject[element.station] = prevState[element.station]
          });
        }
        return returnObject;
      });
    })
    .catch(e => console.log(e));
   }
  render() {
    // console.log(this.state)
    const riversIppPs = this.state.riversIppPs.mw ? this.state.riversIppPs.mw.toFixed(2) : 0;
    const afamViTs = this.state.afamViTs.mw ? this.state.afamViTs.mw.toFixed(2) : 0;
    const gereguPs = this.state.gereguPs.mw ? this.state.gereguPs.mw.toFixed(2) : 0;
    const omotosho2 = this.state.omotosho2.mw ? this.state.omotosho2.mw.toFixed(2) : 0;
    const omotoshoNippPs = this.state.omotoshoNippPs.mw ? this.state.omotoshoNippPs.mw.toFixed(2) : 0;
    const delta3 = this.state.delta3.mw ? this.state.delta3.mw.toFixed(2) : 0;
    const sapeleNippPs = this.state.sapeleNippPs.mw ? this.state.sapeleNippPs.mw.toFixed(2) : 0;
    const omokuPs1 = this.state.omokuPs1.mw ? this.state.omokuPs1.mw.toFixed(2) : 0;
    const odukpaniGs = this.state.odukpaniGs.mw ? this.state.odukpaniGs.mw.toFixed(2) : 0;
    const ikotEkpene = this.state.ikotEkpene.mw ? this.state.ikotEkpene.mw.toFixed(2) : 0;
    const alaoji = this.state.alaoji.mw ? this.state.alaoji.mw.toFixed(2) : 0;
    const ekim = this.state.ekim.mw ? this.state.ekim.mw.toFixed(2) : 0;
    const gwagwalada = this.state.gwagwalada.mw ? this.state.gwagwalada.mw.toFixed(2) : 0;
    const lokojaTs = this.state.lokojaTs.mw ? this.state.lokojaTs.mw.toFixed(2) : 0;
    const phMain = this.state.phMain.mw ? this.state.phMain.mw.toFixed(2) : 0;
    const eket = this.state.eket.mw ? this.state.eket.mw.toFixed(2) : 0;
    const azura = this.state.ihovborNippPs.mw ? this.state.ihovborNippPs.mw.toFixed(2) : 0;
    const totalGeneration = Number(azura) + Number(phMain) + Number(riversIppPs) + Number(afamViTs) + Number(gereguPs) + Number(omotosho2) + Number(omotoshoNippPs) + Number(delta3) + Number(sapeleNippPs) + Number(omokuPs1);
    const totalTransmission = Number(eket) + Number(phMain) + Number(lokojaTs) + Number(gwagwalada) + Number(ekim) + Number(alaoji) + Number(ikotEkpene) + Number(odukpaniGs);
    return (
      <div className="menu">
        <div className="message text-white rounded">
          TCN Tool to query equipment parameters and state
        </div>
        <div className="menu-list" style={{display: `${this.state.display}`}}>
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
          <h2 className="text-white">Generating Stations</h2>
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
                <th>1</th>
                <th>RIVERS IPP</th>
                <th>CN</th>
                <th>{this.state.riversIppPs.mw ? this.state.riversIppPs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.riversIppPs.kv ? this.state.riversIppPs.kv : 0 }</th>
              </tr>
              <tr>
                <th>2</th>
                <th>AFAM 6</th>
                <th>CN</th>
                <th>{this.state.afamViTs.mw ? this.state.afamViTs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.afamViTs.kv ? this.state.afamViTs.kv : 0 }</th>
              </tr>
              <tr>
                <th>3</th>
                <th>GEREGU GAS</th>
                <th>CN</th>
                <th>{this.state.gereguPs.mw ? this.state.gereguPs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.gereguPs.kv ? this.state.gereguPs.kv : 0 }</th>
              </tr>
              <tr>
                <th>4</th>
                <th>OMOTOSHO GAS</th>
                <th>NC</th>
                <th>{this.state.omotosho2.mw ? this.state.omotosho2.mw.toFixed(2) : 0 }</th>
                <th>{this.state.omotosho2.kv ? this.state.omotosho2.kv : 0 }</th>
              </tr>
              <tr>
                <th>5</th>
                <th>OMOTOSHO NIPP</th>
                <th>CN</th>
                <th>{this.state.omotoshoNippPs.mw ? this.state.omotoshoNippPs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.omotoshoNippPs.kv ? this.state.omotoshoNippPs.kv : 0 }</th>
              </tr>
              <tr>
                <th>6</th>
                <th>DELTA-3</th>
                <th>CN</th>
                <th>{this.state.delta3.mw ? this.state.delta3.mw.toFixed(2) : 0 }</th>
                <th>{this.state.delta3.kv ? this.state.delta3.kv : 0 }</th>
              </tr>
              <tr>
                <th>7</th>
                <th>SAPELE NIPP</th>
                <th>CN</th>
                <th>{this.state.sapeleNippPs.mw ? this.state.sapeleNippPs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.sapeleNippPs.kv ? this.state.sapeleNippPs.kv : 0 }</th>
              </tr>
              <tr>
                <th>8</th>
                <th>OMOKU</th>
                <th>CN</th>
                <th>{this.state.omokuPs1.mw ? this.state.omokuPs1.mw.toFixed(2) : 0 }</th>
                <th>{this.state.omokuPs1.kv ? this.state.omokuPs1.kv : 0 }</th>
              </tr>
              <tr>
                <th>9</th>
                <th>AZURA</th>
                <th>CN</th>
                <th>{this.state.ihovborNippPs.mw ? this.state.ihovborNippPs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.ihovborNippPs.kv ? this.state.ihovborNippPs.kv : 0 }</th>
              </tr>
              <tr>
                <th>7</th>
                <th>TRANS AMADI</th>
                <th>CN</th>
                <th>{this.state.phMain.mw ? this.state.phMain.mw.toFixed(2) : 0 }</th>
                <th>{this.state.phMain.kv ? this.state.phMain.kv : 0 }</th>
              </tr>
              <tr className="hidden">
                <th>8</th>
                <th>GEREGU NIPP</th>
                <th>CN</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>
              <tr className="hidden" >
                <th>9</th>
                <th>GBARAIN</th>
                <th>NC</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>
              <tr className="hidden">
                <th>10</th>
                <th>DADI-KOWA HYDRO</th>
                <th>PNDG</th>
                <th>0</th>
                <th>---</th>
              </tr>
              <tr className="hidden">
                <th>11</th>
                <th>PARAS ENERGY</th>
                <th>NC</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>
              <tr className="hidden">
                <th>12</th>
                <th>OMOKU</th>
                <th>NC</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>
              <tr className="hidden">
                <th>13</th>
                <th>DELTA-2</th>
                <th>NC</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>
              <tr className="hidden">
                <th>14</th>
                <th>OLORUNSOGO GAS</th>
                <th>CN</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>
              <tr className="hidden">
                <th>15</th>
                <th>OLORUNSOGO NIPP</th>
                <th>CN</th>
                <th>N/A</th>
                <th>N/A</th>
              </tr>              
              <tr >
                <th></th>
                <th>TOTAL</th>
                <th></th>
                <th>{totalGeneration.toFixed(2)}</th>
                <th></th>
              </tr>              
            </tbody>
          </table>

          <h2 className="text-white">Transmission Stations</h2>
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
              <th>1</th>
                <th>ODUKPANI</th>
                <th>CN</th>
                <th>{this.state.odukpaniGs.mw ? this.state.odukpaniGs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.odukpaniGs.kv ? this.state.odukpaniGs.kv : 0 }</th>
              </tr>
              <tr>
                <th>2</th>
                <th>IKOT EKPENE TS</th>
                <th>CN</th>
                <th>{this.state.ikotEkpene.mw ? this.state.ikotEkpene.mw.toFixed(2) : 0 }</th>
                <th>{this.state.ikotEkpene.kv ? this.state.ikotEkpene.kv : 0 }</th>
              </tr>
              <tr>
                <th>3</th>
                <th>ALAOJI NIPP</th>
                <th>CN</th>
                <th>{this.state.alaoji.mw ? this.state.alaoji.mw.toFixed(2) : 0 }</th>
                <th>{this.state.alaoji.kv ? this.state.alaoji.kv : 0 }</th>
              </tr>
              <tr>
                <th>4</th>
                <th>EKIM TS</th>
                <th>CN</th>
                <th>{this.state.ekim.mw ? this.state.ekim.mw.toFixed(2) : 0 }</th>
                <th>{this.state.ekim.kv ? this.state.ekim.kv : 0 }</th>
              </tr>
              <tr>
                <th>5</th>
                <th>GWAWALADA TS</th>
                <th>CN</th>
                <th>{this.state.gwagwalada.mw ? this.state.gwagwalada.mw.toFixed(2) : 0 }</th>
                <th>{this.state.gwagwalada.kv ? this.state.gwagwalada.kv : 0 }</th>
              </tr>
              <tr>
                <th>6</th>
                <th>LOKOJA TS</th>
                <th>CN</th>
                <th>{this.state.lokojaTs.mw ? this.state.lokojaTs.mw.toFixed(2) : 0 }</th>
                <th>{this.state.lokojaTs.kv ? this.state.lokojaTs.kv : 0 }</th>
              </tr>
              <tr>
                <th>7</th>
                <th>PORTHARCOURT MAIN TS</th>
                <th>CN</th>
                <th>{this.state.phMain.mw ? this.state.phMain.mw.toFixed(2) : 0 }</th>
                <th>{this.state.phMain.kv ? this.state.phMain.kv : 0 }</th>
              </tr>
              <tr>
                <th>8</th>
                <th>EKET TS</th>
                <th>CN</th>
                <th>{this.state.eket.mw ? this.state.eket.mw.toFixed(2) : 0 }</th>
                <th>{this.state.eket.kv ? this.state.eket.kv : 0 }</th>
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
