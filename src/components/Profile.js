import React from "react";
import stations from "./stations";
import stationsKey from "./stationsKey";
import Header from "./table/ProfileHeader";
import Row from "./table/ProfileRow";
import { Spinner, Button } from "react-bootstrap";

 class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.setParameter = this.setParameter.bind(this);
    this.setProfileType = this.setProfileType.bind(this);
    this.setStation = this.setStation.bind(this);
    this.setEquipment = this.setEquipment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      selectedStation: '',
      selectedEquipment: '',
      equipment: [],
      startDate: '',
      endDate : '',
      parameter: '',
      profileType: '',
      loading: false,
      tableRows: []
    }
  }
  componentDidMount() {
    this.setStation();
    this.setParameter();
    this.setProfileType();
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
  setParameter() {
    this.setState( prevState => {
      prevState.parameter = this.parameter.options[this.parameter.selectedIndex].value;
      return {parameter : prevState.parameter}
    });
  }
  setProfileType() {
    this.setState( prevState => {
      prevState.profileType = this.profileType.options[this.profileType.selectedIndex].value;
      return {profileType : prevState.profileType}
    });
  }
  handleSubmit() {
    const station = stationsKey[this.state.selectedStation];
    const equipment = this.state.selectedEquipment.toLowerCase();
    const startDate = this.state.startDate[0];
    const endDate = this.state.endDate[0];
    const startTime = this.state.startDate[1];
    const endTime = this.state.endDate[1];
    const { parameter, profileType } = this.state;
    const token = JSON.stringify(localStorage.getItem("token"));
    // verify that the startDate is lower than the endDate
    const getProfile = station && equipment && startDate && endDate && startTime && endTime && parameter && profileType;
    if(getProfile) {
      const url = '/lines/profile';
      const data = {
        station,
        equipment,
        startDate,
        endDate,
        startTime,
        endTime,
        profileType,
        parameter
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
          const TableRow = [];
          const data = resp.res[0];
          const station = this.state.selectedStation;
          const equipment = this.state.selectedEquipment;
          const { parameter } = this.state;
          // create the table that would show the data history          
          data.station = station;
          data.equipment = equipment;
          data.parameter = parameter;
          TableRow.push(<Row data={data} key='1' />)        
          this.setState(prevState => {
            prevState.tableRows = TableRow;
            return {tableRows: prevState.tableRows, loading: false}
          });
        });
      })
    }    
  }

  render() {
    const { loading, tableRows } = this.state;
    // get the stations from the keys of the object
    const stationer = Object.keys(stations);
    // population the stations inside the options element for the select element's use
    const stationArray = [<option disabled key={0}>Select Station</option>];
    stationer.forEach((station, index) => stationArray.push(<option value={station} key={index + 1}> {station} </option>));
    return (
      <div>
        <a style={{margin: '10px', 'fontSize': '15px'}} type="button" href="/"> back</a>        
        <div>
          <h2 className="history-text"> Get Profile of an equipment</h2>
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
          {/* Select parameter */}
          <div className="options">
            <label> 
              Select Parameter 
            </label>
            <select onChange={this.setParameter} ref={node => this.parameter = node} >
              <option disabled>select parameter</option>
              <option value={'mw'}>Power</option>
              <option value={'amp'}>Current</option>
              <option value={'kv'}>Voltage</option>
              <option value={'mvar'}>Reactive Power</option>
            </select>
          </div>
          {/* Select Profile type */}
          <div className="options">
            <label> 
              Select Profile type 
            </label>
            <select onChange={this.setProfileType} ref={node => this.profileType = node} >
              <option disabled>select profile type</option>
              <option value={'max'}>Maximum</option>
              <option value={'min'}>Minimum</option>
            </select>
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
            <table className="tg">
            <Header profileType={this.state.profileType} />
            <tbody>
              {tableRows}              
            </tbody>
          </table>
          }         
        </div>
      </div> 
    )         
  }
}

export default Profile
