import React from "react";
import stations from "./stations";
import stationsKey from "./stationsKey";
import { Spinner, Button } from "react-bootstrap";

 class Downtime extends React.Component {
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
      loading: false,
      tableLis: []
    }
  }
  componentDidMount() {
    this.setStation();
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
    const station = stationsKey[this.state.selectedStation];
    const equipment = this.state.selectedEquipment.toLowerCase();
    const startDate = this.state.startDate[0];
    const endDate = this.state.endDate[0];
    const startTime = this.state.startDate[1];
    const endTime = this.state.endDate[1];
    const token = JSON.stringify(localStorage.getItem("token"));
    // verify that the startDate is lower than the endDate
    const getDowntime = station && equipment && startDate && endDate && startTime && endTime;
    if(getDowntime) {
      const url = '/lines/downtime';
      const data = {
        station,
        equipment,
        startDate,
        endDate,
        startTime,
        endTime
      };
      // add a spinner method while request is loading
      this.setState({loading: true}, () => {
        fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            credentials: 'include'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then( resp => {
          // retrieve the data and use it to populate the view
          const TableLis = [];
          const data = resp.res;
          if(typeof data === 'string') {
            TableLis.push(<li key={1} >{ data }  </li>)
            return this.setState({TableLis})
          }
          const station = this.state.selectedStation;
          const equipment = this.state.selectedEquipment;
          const dataKeys = Object.keys(data);
          // create the table that would show the data history
          dataKeys.forEach((dat, index) => {
            let start = data[index][0];
            let end = data[index][1];
            if(end === undefined) {
              end = 'its still out'
            }
            TableLis.push(<li key={index} >The Equipment was down between {start} and {end}  </li>)   
          })
          data.station = station;
          data.equipment = equipment;
               
          this.setState(prevState => {
            prevState.tableLis = TableLis;
            return {tableLis: prevState.tableLis, loading: false}
          });
        })
        .catch(e => {
          console.error(e)
          this.setState({loading: false})
        });
      })
    }    
  }

  render() {
    const { loading, tableLis } = this.state;
    // get the stations from the keys of the object
    const stationer = Object.keys(stations);
    // population the stations inside the options element for the select element's use
    const stationArray = [<option disabled key={0}>Select Station</option>];
    stationer.forEach((station, index) => stationArray.push(<option value={station} key={index + 1}> {station} </option>));
    return (
      <div>
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/"> back</a>        
        <div>
          <h2 className="history-text"> Get Downtime of an equipment</h2>
          {/* Select Station */}
          <div className="options">
            <label> 
              Select Station 
            </label>
            <select onChange={this.setStation} ref={node => this.stationsOption = node} >
              {stationArray}
            </select>
          </div>
          {/* Select Equipment */}
          <div className="options">
            <label> 
              Select Equipment
            </label>
            <select onChange={this.setEquipment} ref={node => this.equipmentOption = node} >
              <option disabled>Select an Equipment</option>
              { this.state.equipment.map( (equip, index) => <option value={equip} key={index}>{equip}</option>)}
            </select>
          </div>
          {/* Select Start Date */}    
          <div className="options">
            <label> Start Date </label> 
            <input type={'datetime-local'} name="startDate" onChange={this.setDate} ref={node => this.startDate = node}></input>
          </div>
          {/* Select End Date */}
          <div className="options">
            <label> End Date </label>
            <input type={'datetime-local'} name='endDate' onChange={this.setDate} ref={node => this.endDate = node}></input>
          </div>
          <button className="submit-button" onClick={this.handleSubmit}> Submit </button>
        </div>
        <div className="table-div">
          {loading ? 
            <Button className="spinner" variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Loading... Please wait
          </Button>
            : 
            <ul className="tg">           
              {tableLis}
            </ul>
          }         
        </div>
      </div> 
    )         
  }
}

export default Downtime
