import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch, Link, withRouter } from 'react-router-dom';
import WeatherWidget_rows from './Weather/WeatherWidget_rows';
import WeatherWidget_cards from './Weather/WeatherWidget_cards';
import socket from "./utility/socketIO";

class WeatherApi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        if(this.props.history.location.pathname === "/nccweather") {
            socket.on("client_message_weather_current", data => {
              const { message } = data;
              const parsedStation = JSON.parse(message);
              const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
              const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
              const returnObject = {}
              this.setState(prevState => {
                prevState["current_weather_stations_generation"] = weather_stations_generation;
                prevState["current_weather_stations_transmission"] = weather_stations_transmission;
                returnObject["current_weather_stations_generation"] = prevState["current_weather_stations_generation"];
                returnObject["current_weather_stations_transmission"] = prevState["current_weather_stations_transmission"]
                return returnObject;
              });
              // add stations with rainfall
              let rain_stations = [];
              const returnObject_2 = {}
              parsedStation.forEach(station => {
                if(station.rain) {
                    rain_stations.push(station);
                }
              })
              this.setState(prevState => {
                prevState["stations_with_rainfall"] = rain_stations;
                returnObject_2["stations_with_rainfall"] = prevState["stations_with_rainfall"];
                return returnObject_2;
              });
            });
            socket.on("client_message_weather_hourly3", data => {
                const { message } = data;
                const parsedStation = JSON.parse(message);
                const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
                const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
                const returnObject = {}
                this.setState(prevState => {
                  prevState["hourly3_weather_stations_generation"] = weather_stations_generation;
                  prevState["hourly3_weather_stations_transmission"] = weather_stations_transmission;
                  returnObject["hourly3_weather_stations_generation"] = prevState["hourly3_weather_stations_generation"];
                  returnObject["hourly3_weather_stations_transmission"] = prevState["hourly3_weather_stations_transmission"]
                  return returnObject;
                })
              });
              socket.on("client_message_weather_daily", data => {
                const { message } = data;
                const parsedStation = JSON.parse(message);
                const weather_stations_generation = parsedStation.filter(station => station.type === 'GENERATION');
                const weather_stations_transmission = parsedStation.filter(station => station.type === 'TRANSMISSION');
                const returnObject = {}
                this.setState(prevState => {
                  prevState["daily_weather_stations_generation"] = weather_stations_generation;
                  prevState["daily_weather_stations_transmission"] = weather_stations_transmission;
                  returnObject["daily_weather_stations_generation"] = prevState["daily_weather_stations_generation"];
                  returnObject["daily_weather_stations_transmission"] = prevState["daily_weather_stations_transmission"]
                  return returnObject;
                })
              });
          }
    };

  render() {
    return <>
        <div className='container-fluid'>
            <div className='row dashboard'>
                <div className='col-xs-3 col-lg-5'>
                    <h2>Generation</h2>
                    <button name='cards_generation'  onClick={(e) => { 
                        this.setState({cards_generation: !this.state.cards_generation});
                        this.setState({rows_generation: false});
                        this.setState({cards_transmission: false});
                        this.setState({rows_transmission: false});
                     }}>
                        <Link >Grid Display</Link>
                    </button>
                    <button name='rows_generation'  onClick={(e) => { 
                        this.setState({cards_generation: false});
                        this.setState({rows_generation: !this.state.rows_generation});
                        this.setState({cards_transmission: false});
                        this.setState({rows_transmission: false});
                     }}>
                        <Link >Row Display</Link>
                    </button>
                </div>
                <div className='col-xs-3 col-lg-5'>
                    <h2>Transmission</h2>
                    <button onClick={() => {
                        this.setState({cards_generation: false});
                        this.setState({rows_generation: false});
                        this.setState({cards_transmission: !this.state.cards_transmission});
                        this.setState({rows_transmission: false});
                    }}>
                        <Link  >Grid Display</Link>
                    </button>
                    <button  onClick={() => { 
                        this.setState({cards_generation: false});
                        this.setState({rows_generation: false});
                        this.setState({cards_transmission: false});
                        this.setState({rows_transmission: !this.state.rows_transmission});
                     }}>
                        <Link >Row Display</Link>
                    </button>
                </div>
                <div className='col-xs-2 col-lg-2'>
                    <button  onClick={() => {  }}>
                        Download Historical Data
                    </button>
                </div>            
            </div>
            {/* Logic to be used for switching form based search of weather data */}
            
            <div style={{display: this.forecast_display ? '' : 'none'}} className='row forecast'>
                
            </div>
            <div style={{display: this.historical_display ? '' : 'none'}} className='row historical'>
    
            </div>
    
            <div className='row weather-container'>
                {this.state.cards_generation ? <WeatherWidget_cards rain_station={this.state.stations_with_rainfall} data="generation" datas={this.state.current_weather_stations_generation} /> : ""} <br /> 
                {this.state.cards_transmission ? <WeatherWidget_cards rain_station={this.state.stations_with_rainfall} data="transmission" datas={this.state.current_weather_stations_transmission} /> : ""} <br /> 
                {this.state.rows_generation ? < WeatherWidget_rows rain_station={this.state.stations_with_rainfall} data="generation" datas={this.state.current_weather_stations_generation} /> : ""} <br /> 
                 {this.state.rows_transmission ? < WeatherWidget_rows rain_station={this.state.stations_with_rainfall} data="transmission" datas={this.state.current_weather_stations_transmission} /> : ""} <br /> 
            </div>
        </div>
    </>
  };
}
export default withRouter(WeatherApi);
