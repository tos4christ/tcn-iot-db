import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch, Link, withRouter } from 'react-router-dom';
import WeatherWidget_single from './WeatherWidget_single';
import { Spinner, Button } from "react-bootstrap";

class TemWeather extends React.Component {

    constructor(props) {
        super(props);
        this.getStationList = this.getStationList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setStation = this.setStation.bind(this);
        this.state = {
            loading: false,
            stations: [],
            station: ""
        }
    }
    componentDidMount() {
        // On load, query for the list of stations or use the one inside the parent component
        this.getStationList();
    };
    getStationList() {
        const url = 'https://tcnnas.org/api/weather/getallstations';          
        fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then( resp => {
            // returns the list of stations which will be added to the state
            // and used to populate the select options
            console.log(resp, " the stations ");
            this.setState(prevState => {
                prevState.stations = resp;
                return {stations: prevState.stations};
            })
        })
        .catch(e => {
            console.error(e);
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        return;
    }
    setStation() {
        this.setState({station: this.station});
    }
    render() {
        const { loading } = this.state;
        return <>
            <div className='container-fluid'>
                <div className="item-divs">     
                    <div>
                    <h2 className="history-text pl-5 pt-2 text-justify">Get Station Forecast</h2>
                    {/* Select Station */}
                    <div className="options">
                        <label> 
                            Search Station 
                        </label>
                        <input type={"text"} style={{width: "50%"}}></input>
                    </div>
                    {/* Select Equipment */}
                    <div className="options">
                        <label> 
                        Select Station
                        </label>
                        <select onChange={this.setStation} ref={node => this.station = node} >
                            <option disabled>Select a Station</option>
                            { this.state.stations.map( (station, index) => <option value={station.name} key={index}>{station.name}</option>)}
                        </select>
                        <button className="submit-button" onClick={this.handleSubmit}> Submit </button>
                    </div>
                    
                    
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
                        
                        </ul>
                    }         
                    </div>
                </div>
            </div>
        </>
    };
}
export default withRouter(TemWeather);
