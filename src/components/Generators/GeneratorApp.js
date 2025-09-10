import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import socket from "../utility/socketIO";
import DateTime from "../DateTime";
import StationSidebar from './StationSidebar';
import GeneratorDetails from './GeneratorDetails';
import { generateStations } from './utils/stationData';

class GeneratorApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStation: null,
      stations: generateStations(),
      egbinPs: {
        id: "egbinPs",
        units: [ {id: "st1", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}, 
                 {id: "st2", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}, 
                 {id: "st3", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}, 
                 {id: "st4", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}, 
                 {id: "st5", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}, 
                 {id: "st6", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}]
      },
      "sapele-gas": {
        id: "sapele-gas",
        units: [ {id: "pb203", pd: {mw:0, a: 0, v: 0, mx: 0, f: 0, pf: 0}}]
      },
    };
  }

  componentDidMount() {
    if(this.props.history.location.pathname === "/generator_units") {
      socket.on("generator_units", data => {
        const { message } = data;
        const parsedMessage = JSON.parse(message);
        // console.log(Object.keys(parsedMessage), 'generator_units message');
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
    }
   }
   componentWillUnmount() {
    socket.off("generator_units");
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
    // Change connected to 'online' and 'offline'
    const connected = 'online';
    const disconnected = 'offline';
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

  handleStationSelect = (station) => {
    this.setState({ selectedStation: station });
  };


  render() {

    try {
      // Get all the stations and its units here and prepare them for the sidebar and details view
      const dummy_stations = generateStations();
      const { selectedStation, egbinPs, "sapele-gas": sapeleGas } = this.state;
      // Merge the real-time data into the dummy stations data
      const stations = [];
      const stationTypes = ['Thermal', 'Hydro', 'Nuclear', 'Wind', 'Solar', 'Gas'];
      const real_stations = [egbinPs, sapeleGas];
      for(let i=1; i<3; i++) {
        // Prepare the real-time units data
        const temp_station = real_stations[i-1];
        // console.log(temp_station, 'temp_station');
        const temp_units = temp_station.units ? temp_station.units : []; 
        let units = [];
        for(let j=0; j<temp_units.length; j++) {
          const unit = temp_units[j];
          units.push({
            id: `unit-${i}-${j}`,
            name: `Unit ${unit.id}`,
            activePower: unit.pd ? unit.pd.mw : 0,
            voltage: unit["pd"] ? unit["pd"].v : 0,
            reactivePower: unit["pd"] ? unit["pd"].mx : 0,
            powerFactor: unit["pd"] ? Number(unit["pd"].pf) : 0,
            frequency: unit["pd"] ? unit["pd"].f : 0,
            status: this.checkConnection2(temp_station.server_time)
          });
        }

        // Prepare the real-time stations data
        stations.push({
          id: `station-${i}`,
          name: `${temp_station["id"]} Power Station ${i.toString().padStart(3, '0')}`,
          type: stationTypes[5],
          units: units,
          location: `Location ${i}`,
          commissioned: Math.floor(Math.random() * 30) + 1990 // 1990-2020
        });
      }
      // Add the dummy stations data
      stations.push(...dummy_stations);
      // stations.sort((a, b) => a.id.localeCompare(b.id));

      return (
        <div className="h-screen flex bg-gray-100">
          <StationSidebar
            stations={stations}
            selectedStation={selectedStation}
            onStationSelect={this.handleStationSelect}
          />
          
          <GeneratorDetails 
            selectedStation={selectedStation} 
            allStations={stations} 
          />
        </div>
      );
    } catch (error) {
      console.error('App component error:', error);
      return null;
    }
  }
}

export default withRouter(GeneratorApp);