import React from "react";
import {NavLink, Link, withRouter, Redirect} from 'react-router-dom';
import stations from "./stations";
import Header from "./table/header";
import Row from "./table/row";

 class History extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.setStation = this.setStation.bind(this);
    this.setEquipment = this.setEquipment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      selectedStation: '',
      selectedEquipment: '',
      equipment: [],
      startDate: '',
      endDate : '',
      tableRows: []
    }
  }
  componentDidMount() {
    this.setState( prevState => {
      prevState.selectedStation = this.stationsOption.options[this.stationsOption.selectedIndex].value;
      const equipment = stations[prevState.selectedStation];
      return {selectedStation : prevState.selectedStation, equipment, selectedEquipment: equipment[0]}
    })
  }
  setDate(e) {    
    const name = e.target.name;
    this.setState( prevState => {
      prevState[name] = this[name].value.split('T');
      return {name : prevState[name]}
    })
  }
  setStation() {
    this.setState( prevState => {
      prevState.selectedStation = this.stationsOption.options[this.stationsOption.selectedIndex].value;
      const equipment = stations[prevState.selectedStation];
      return {selectedStation : prevState.selectedStation, equipment, selectedEquipment: equipment[0]}
    });
  }
  setEquipment() {
    this.setState( prevState => {
      prevState.selectedEquipment = this.equipmentOption.options[this.equipmentOption.selectedIndex].value;
      return {selectedEquipment : prevState.selectedEquipment}
    });
  }
  handleSubmit() {
    const station = this.state.selectedStation;
    const equipment = this.state.selectedEquipment;
    const startDate = this.state.startDate[0];
    const endDate = this.state.endDate[0];
    const startTime = this.state.startDate[1];
    const endTime = this.state.endDate[1];
    // verify that the startDate is lower than the endDate
    const getHistory = station && equipment && startDate && endDate && startTime && endTime;
    if(getHistory) {
      const url = '/lines/history';
      const data = {
        station,
        equipment,
        startDate,
        endDate,
        startTime,
        endTime
      };
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then( resp => {
        // retrieve the data and use it to populate the view
        const TableRow = [];
        const datas = resp.res;
        // create the table that would show the data history
        datas.forEach((data, index) => {
           TableRow.push(<Row data={data} key={index} />)
        });
        this.setState(prevState => {
          prevState.tableRows = TableRow;
          return {tableRows: prevState.tableRows}
        })
        console.log(TableRow, 'table rows')
      })
    }
    
  }
  render() {
    // get the stations from the keys of the object
    const stationer = Object.keys(stations);
    // population the stations inside the options element for the select element's use
    const stationArray = [<option disabled key={0}>Select Station</option>];
    stationer.forEach((station, index) => stationArray.push(<option value={station} key={index + 1}> {station} </option>));
    return (
      <div>
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/"> back</a>        
        <div>
          <h2 className="history-text"> Get History</h2>
          {/* Select Station */}
          <label className="input-text block-display"> 
            Select Station 
            <select onChange={this.setStation} ref={node => this.stationsOption = node} >
              {stationArray}
            </select>
          </label>

          {/* Select Equipment */}
          <label className="input-text block-display"> 
            Select Equipment
            <select onChange={this.setEquipment} ref={node => this.equipmentOption = node} >
              <option disabled>Select an Equipment</option>
              { this.state.equipment.map( (equip, index) => <option value={equip} key={index}>{equip}</option>)}
            </select>
          </label>

          <label className="history-text label"> Start Date </label> <input type={'datetime-local'} name="startDate" onChange={this.setDate} ref={node => this.startDate = node}></input>
          <br />
          <label className="history-text label"> End Date </label> <input type={'datetime-local'} name='endDate' onChange={this.setDate} ref={node => this.endDate = node}></input>
          <button className="submit-button" onClick={this.handleSubmit}> Submit </button>
        </div>
        <div>
          <table className="tg">
            <Header />
            <tbody>
              {this.state.tableRows}
            </tbody>
          </table>
        </div>
      </div> 
    )         
  }
}

export default History