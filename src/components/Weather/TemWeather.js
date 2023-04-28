import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch, Link, withRouter } from 'react-router-dom';
import WeatherWidget_single from './WeatherWidget_single';
import { Spinner, Button } from "react-bootstrap";

class TemWeather extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            cards_generation: false,
            rows_generation: false,
            cards_transmission: false,
            rows_transmission: false,
            stations: [],
            stations_with_rainfall: [],
            current_weather_stations_generation: [],
            current_weather_stations_transmission: [],
            hourly3_weather_stations_generation: [],
            hourly3_weather_stations_transmission: [],
            daily_weather_stations_generation: [],
            daily_weather_stations_transmission: [],
            station: [],
            stations_promise_array: [],
            current_display: false,
            forecast_display: false,
            historical_display: false,
            lon: 0,
            lat: 0,
            station_name: null,
            weather_main: null,
            weather_description: null,
            temp: null,
            feels_like: null,
            humidity: null,
            pressure: null,
            wind_speed: null,
            wind_degree: null,
            wind_gust: null,
            weather_date: null,
            data: null
        }
    }
    componentDidMount() {
        // On load, query for the list of stations or use the one inside the parent component
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
            
        })
        .catch(e => {
            console.error(e);
        })
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
                        <select onChange={this.setEquipment} ref={node => this.equipmentOption = node} >
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
