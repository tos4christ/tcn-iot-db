import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch, Link, withRouter } from 'react-router-dom';
import WeatherWidget_rows from './Weather/WeatherWidget_rows';
import WeatherWidget_cards from './Weather/WeatherWidget_cards';

const cordinates = [
    {lon: 7.35582222222222, lat: 5.09995555555555, name: "Aba TS"},
    {lon: 3.3908055555084, lat: 7.10401944510485, name: "Abeokuta TS"},
    {lon: 3.57112222222222, lat: 6.47070833333333, name: "Ajah TS"}
]
const apiKey = 'd92e84063dd0e4bfdb345d4cad0c9c66';

class WeatherApi extends React.Component {
    constructor(props) {
        super(props);
        this.getWeather = this.getWeather.bind(this);
        this.setStation = this.setStation.bind(this);
        this.fetchStations = this.fetchStations.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.setStationData = this.setStationData.bind(this);
        this.state = {
            cards_generation: false,
            rows_generation: false,
            cards_transmission: false,
            rows_transmission: false,
            stations: [],
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

    fetchStations() {
        // Set the stations inside local storage so that the weather data
        // can be attached to them
        // Get the list of all the stations once and set it in the state
        const stations_url = 'https://tcnnas.org/getallstations'
        fetch(stations_url)
            .then(res => res.json())
            .then((res) => {
                const stations = res.rows;
                // update the state that corresponds to the name of the station
                this.setStations(stations);
                localStorage.setItem(stations);
            })
            .catch()    
        // set a timeout to call all the stations by iterating on their longitude
        const stations = this.state.stations;
        const stations_holder = []
        if(stations.length > 0) {            
            stations.forEach(station => {
                stations_holder.push(
                    new Promise((resolve, reject)=> {
                        const {lon, lat, name} = station;
                        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid={apikey}`;
                        fetch(url)
                            .then(res => res.json())
                            .then((res) => {
                                // update the state that corresponds to the name/lon&lat of the station
                                const selected_station = stations.filter( station => station.lon === lon && station.lat === lat);
                                selected_station.weather_data = res.rows;
                                this.setStations(stations);
                                localStorage.setItem(stations);
                            })
                            .catch()
                    })
                )
            })
        }
        if(stations_holder.length > 0) {
            Promise.all(stations_holder);
        }
    }
    fetchData() {
        // set a timeout to call all the stations by iterating on their longitude
        const stations = cordinates;
        const stations_holder = []
        if(stations.length > 0) {            
            stations.forEach(station => {
                stations_holder.push(
                    new Promise((resolve, reject)=> {
                        const {lon, lat, name} = station;
                        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=daily,hourly&appid=${apiKey}`;
                        fetch(url)
                            .then(res => res.json())
                            .then((res) => {
                                // update the state that corresponds to the name/lon&lat of the station
                                const selected_station = stations.filter( station => station.lon === lon && station.lat === lat);
                                selected_station.weather_data = res.rows;
                                this.setStations(stations);
                                localStorage.setItem(stations);
                            })
                            .catch()
                    })
                )
            })
        }
        // if(stations_holder.length > 0) {
        //     Promise.all(stations_holder);
        // }
    }
    componentDidMount() {
        //console.log(this.props);
        this.fetchData();
    };
    getWeather(e) {
        e.preventDefault();
        const url_1 = `https://api.openweathermap.org/data/2.5/weather?lat=${'lat'}&lon=${'long'}&appid=${apiKey}`;
        const url = '/frequency/weather';
        const body = {url: url_1}
        fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then((response) => {
            console.log(response, "this is the response");
            // Note that the weather is return in Kelvin
            // Subtract 273.15 from the resulting temperature to 
            // get its actual value
            const { weather } = response;
            this.setStationName(weather.name);
            this.setWeatherMain(weather.weather[0].main);
            this.setWeatherDescription(weather.weather[0].description);
            this.setTemp(weather.main.temp);
            this.setFeelsLike(weather.main.feels_like);
            this.setHumidity(weather.main.humidity);
            this.setPressure(weather.main.pressure);
            this.setWindSpeed(weather.wind.speed);
            this.setWindDegree(weather.wind.deg);
            this.setWindGust(weather.wind.gust);
            this.setWeatherDate(weather.dt);
        })
        .catch((error) => console.error(error.message));
    }
    setStation(value) {
        //e.preventDefault();
        const coords = cordinates[value];
        // setLong(coords.longitude);
        // setLat(coords.latitude);
    }
    setStationData(name) {

        // based on the name of the button selected
        // set the station data based on the button selected
    }

  render() {
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
            <div style={{display: this.current_display ? '' : 'none'}} className='row current'>
                <form onSubmit={this.getWeather} >
                    <label className='disco_form_label'>
                        <span className='label-span'>Select Station</span>
                        <select defaultValue={"Select Station"} required onChange={e => this.setStation(e.target.value) } >
                            <option disabled value="Select Station">Select Station</option>
                            <option value="Aba">Aba</option>
                            <option value="Abeokuta">Abeokuta</option>
                            <option value="Ajah">Ajah</option>
                        </select>
                    </label>                
                    <label className='disco_form_label'>                    
                        <button type="submit" className='disco_form_label'>Get Current Weather</button>
                    </label>
                </form>
            </div>
            <div style={{display: this.forecast_display ? '' : 'none'}} className='row forecast'>
                
            </div>
            <div style={{display: this.historical_display ? '' : 'none'}} className='row historical'>
    
            </div>
            <div className='row display'>
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
            </div>
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
