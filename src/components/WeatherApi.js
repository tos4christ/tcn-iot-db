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
              })
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
    console.log(this.state.daily_weather_stations_generation, " the generation data daily");
    console.log(this.state.daily_weather_stations_transmission, " the transmission data daily");
    return <>
        <div className='container-fluid'>
            <div className='row dashboard'>
                <div className='col-md-8 col-lg-6 col-xl-4'>
                    <h2>Generation</h2>
                    <button name='cards_generation'  onClick={(e) => { 
                        this.setState({cards_generation: !this.state.cards_generation});
                        this.setState({rows_generation: false});
                        this.setState({cards_transmission: false});
                        this.setState({rows_transmission: false});
                        this.setStationData('cards_generation');
                     }}>
                        <Link >Grid Display</Link>
                    </button>
                    <button name='rows_generation'  onClick={(e) => { 
                        this.setState({cards_generation: false});
                        this.setState({rows_generation: !this.state.rows_generation});
                        this.setState({cards_transmission: false});
                        this.setState({rows_transmission: false});
                        this.setStationData('rows_generation');
                     }}>
                        <Link >Row Display</Link>
                    </button>
                </div>
                <div className='col-md-8 col-lg-6 col-xl-4'>
                    <h2>Transmission</h2>
                    <button onClick={() => {
                        this.setState({cards_generation: false});
                        this.setState({rows_generation: false});
                        this.setState({cards_transmission: !this.state.cards_transmission});
                        this.setState({rows_transmission: false});
                        this.setStationData('cards_transmission');
                    }}>
                        <Link  >Grid Display</Link>
                    </button>
                    <button  onClick={() => { 
                        this.setState({cards_generation: false});
                        this.setState({rows_generation: false});
                        this.setState({cards_transmission: false});
                        this.setState({rows_transmission: !this.state.rows_transmission});
                        this.setStationData('rows_transmission');
                     }}>
                        <Link >Row Display</Link>
                    </button>
                </div>
                <div className='col-md-8 col-lg-6 col-xl-4'>
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
            {/* <div className='row display'>
            { !this.state.station_name ? '' : ( <div className='weather_display'>
                <h1> Station Name: {  this.state.station_name  }</h1>
                <label className='weather_label'>                    
                    <span> Main weather: {  this.state.weather_main  }  </span>
                    <span> Weather Description: {  this.state.weather_description  } </span>
                </label>
                <label className='weather_label'>                    
                    <span> Current Temperature: {  (Number(this.state.temp) - 273.15).toFixed(2)  } Celsius</span>
                    <span> Room Temperature feels like: {  (Number(this.state.feels_like) - 273.15).toFixed(2)  } Celcius</span>
                </label>
                <label className='weather_label'>                    
                    <span>Humidity: {  this.state.humidity  }</span>
                    <span>Pressure: {  this.state.pressure  }</span>
                </label>
                <label className='weather_label'>                    
                    <span> Wind Speed: {  this.state.wind_speed  }Km/H </span>
                    <span> Wind Degree: {  this.state.wind_degree  } degrees</span>
                    <span> Wind Gust: {  this.state.wind_gust  }</span>
                </label>
                <label className='weather_label'>                    
                    Date: {  this.state.weather_date  } in epoch Time
                </label> 
                </div>)
                }
            </div> */}
            <div className='row' style={{width: "165%", marginLeft: "2em"}}>
                {this.state.cards_generation ? <WeatherWidget_cards data={"generation data"} /> : ""} <br /> 
                {this.state.cards_transmission ? <WeatherWidget_cards data={"transmission data"} /> : ""} <br /> 
                {this.state.rows_generation ? < WeatherWidget_rows data={"generation data"} /> : ""} <br /> 
                 {this.state.rows_transmission ? < WeatherWidget_rows data={"transmission data"} /> : ""} <br /> 
            </div>
        </div>
        <Switch>
            <Route exact path={`${this.props.location.pathname}/cards-transmission`}>
                <WeatherWidget_cards data={this.state.stations} />
            </Route>
            <Route path={`${this.props.location.pathname}/rows-transmission`}>
                <WeatherWidget_rows data={this.state.stations} />
            </Route>
            <Route path={`${this.props.location.pathname}/:cards-generation`}>
                <WeatherWidget_cards data={this.state.stations} />
            </Route>
            <Route path={`${this.props.location.pathname}/:rows-generation`}>
                <WeatherWidget_rows data={this.state.stations} />
            </Route>
        </Switch>
    </>
  };
}
export default withRouter(WeatherApi);
