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
        this.searchStation = this.searchStation.bind(this);
        this.state = {
            loading: false,
            stations: [],
            station: {},
            showWeatherData: false,
            current_weather: [],
            hourly_weather: [],
            daily_weather: [],
            weatherData: {}
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
                prevState.stations = resp.stations;
                return {stations: prevState.stations, station: resp.stations[0]};
            })
        })
        .catch(e => {
            console.error(e);
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        // use the coordinates of selected station to query the weather API
        const { station } = this.state;
        // hit the tcnnas backend with the api request
        const url = "https://tcnnas.org/api/weather/getweather";
        const data = {lon: station.long, lat: station.lat};
        this.setState({loading: true}, () => {
        fetch(url, {
            method: 'POST',
            headers: {
            //  Authorization: `Bearer ${token}`,
            //   credentials: 'include'
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then( resp => {
            // set the state of the variables that would show the component
            // and also populate the view for the forecast
            console.log(resp, " the response from the search");
            this.setState(prevState => {
                prevState.weatherData = resp.data;
                return {weatherData: prevState.weatherData, loading: false, showWeatherData: true}
              });
          });
        })
    }
    setStation() {
        const selectedStation = this.station.options[this.station.selectedIndex].value;        
        const theStation = this.state.stations.filter(station => station.name === selectedStation);
        console.log( theStation, " the station");
        this.setState({station: theStation[0]});
    }
    searchStation() {
        return;
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
                        <input type={"text"} style={{width: "50%"}} onChange={this.searchStation}></input>
                    </div>
                    {/* Select Equipment */}
                    <div className="options">
                        <label> 
                        Select Station
                        </label>
                        <select onChange={this.setStation} ref={node => this.station = node} >
                            <option disabled key={0}>Select a Station</option>
                            { this.state.stations.map( (station, index) => <option value={station.name} key={index+1}>{station.name}</option>)}
                        </select>
                        <button className="submit-button" onClick={this.handleSubmit}> Submit </button>
                    </div>
                    </div>
                    <div >
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
                        this.state.showWeatherData? 
                        <WeatherWidget_single weatherData={this.state.weatherData} station_name={this.state.station.name} />
                        : ""
                    }         
                    </div>
                </div>
            </div>
        </>
    };
}
export default withRouter(TemWeather);
