import React from "react";
import stations from "./stations";
import stationsKey from "./stationsKey";
import Header from "./table/ProfileHeader";
import Row from "./table/ProfileRow";
import { Spinner, Button } from "react-bootstrap";

 class Average extends React.Component {
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
      loading: false,
      tableRows: []
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
    const checkDate = this.state.startDate[0];
    // console.log(checkDate, 'the check date')
    // verify that the startDate is lower than the endDate
    const getAverage = station && equipment && checkDate;
    if(getAverage) {
      const url = '/lines/average';
      const data = {
        station,
        equipment,
        checkDate
      };
      // add a spinner method while request is loading
      this.setState({loading: true}, () => {
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
          const data = resp.res[0];
          const station = this.state.selectedStation;
          const equipment = this.state.selectedEquipment;
          // create the table that would show the data history          
          data.station = station;
          data.equipment = equipment;
          TableRow.push(<Row data={data} key='1' />)        
          this.setState(prevState => {
            prevState.tableRows = TableRow;
            return {tableRows: prevState.tableRows, loading: false}
          });
        })
        .catch(e => {
          console.log(e); 
          this.setState({loading: false});
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
          <h2 className="history-text"> Get 5 mins average of an equipment for the selected date</h2>
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
            <label> Date </label> 
            <input type={'datetime-local'} name="startDate" onChange={this.setDate} ref={node => this.startDate = node}></input>
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
            <Header />
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

export default Average
