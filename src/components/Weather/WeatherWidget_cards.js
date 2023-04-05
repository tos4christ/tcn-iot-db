import React from "react";
import { useParams, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faWind } from '@fortawesome/free-solid-svg-icons'
import { icon } from "@fortawesome/fontawesome-svg-core";

class WeatherWidget_cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weather_data: this.props.data,
            display_data: [],
            start: 0
        }
    }
    componentDidMount() {
        const display_data = this.props.data.slice(this.state.start, (this.state.start + 6))
        this.setState({display_data})
    }
    next() {
        const { start } = this.state;
        const length = this.props.data.length;
        if(start + 6 <= length) {
            const display_data = this.props.data.slice(start, (start + 6))
            this.setState({display_data, start: (start + 6)})
        }        
    }
    previous() {
        const { start } = this.state;
        const length = this.props.data.length;
        if(start - 6 >= 0) {
            const display_data = this.props.data.slice((start - 6), start)
            this.setState({display_data, start: (start - 6)})
        }        
    }
    render() {
        function getIconUrl(icon_id)  {
            return `https://openweathermap.org/img/wn/${icon_id}@2x.png`
        }
        function getTime(dt) {
            const newDate = new Date(dt*1000);
            const hour = newDate.getHours();
            const minute = "0" + newDate.getMinutes();  
            return hour + ':' + minute.substring(1);
        }
        const stations = this.state.display_data;
        const display_1 = [];
        [0,1,2].forEach(index => {
            const station_weather_data = stations[index].weather_data;
            const station_name = stations[index];
            const timer = getTime(station_weather_data.dt);
            const main = station_weather_data.weather[0].main;
            const description = station_weather_data.weather[0].description;
            const icon_url = getIconUrl(station_weather_data.weather[0].icon);
            const temp = station_weather_data.main.temp;
            const feels_like = station_weather_data.main.feels_like;
            const rain = station_weather_data.rain["1h"];
            const wind_speed = station_weather_data.wind.speed;
            const wind_degree = station_weather_data.wind.deg;
            const wind_gust = station_weather_data.wind.gust;
            const humidity = station_weather_data.main.humidity;
            display_1.push(
                <>
                    <div className="col-md-8 col-lg-6 col-xl-4">
                        <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                            <div className="card-body p-4">
                                <div className="d-flex">
                                <h6 className="flex-grow-1">{station_name}</h6>
                                <h6>{timer}</h6>
                                </div>
                                <div className="d-flex flex-column text-center mt-5 mb-4">
                                <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> {temp}°C </h6>
                                <span className="small" style={{"color": "#868B94"}}>{main}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {wind_speed}km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {humidity}% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {rain}h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={icon_url} width="100px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        });
        const display_2 = [];
        [3,4,5].forEach(index => {
            const station_weather_data = stations[index].weather_data;
            const station_name = stations[index];
            const timer = getTime(station_weather_data.dt);
            const main = station_weather_data.weather[0].main;
            const description = station_weather_data.weather[0].description;
            const icon_url = getIconUrl(station_weather_data.weather[0].icon);
            const temp = station_weather_data.main.temp;
            const feels_like = station_weather_data.main.feels_like;
            const rain = station_weather_data.rain["1h"];
            const wind_speed = station_weather_data.wind.speed;
            const wind_degree = station_weather_data.wind.deg;
            const wind_gust = station_weather_data.wind.gust;
            const humidity = station_weather_data.main.humidity;
            display_2.push(
                <>
                    <div className="col-md-8 col-lg-6 col-xl-4">
                        <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                            <div className="card-body p-4">
                                <div className="d-flex">
                                <h6 className="flex-grow-1">{station_name}</h6>
                                <h6>{timer}</h6>
                                </div>
                                <div className="d-flex flex-column text-center mt-5 mb-4">
                                <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> {temp}°C </h6>
                                <span className="small" style={{"color": "#868B94"}}>{main}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {wind_speed}km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {humidity}% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> {rain}h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src={icon_url} width="100px"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        })
        return (
            <section className="container-fluid" style={{"background-color": "#4B515D"}}>
                <div className="row">
                    <div className="col-9 py-3" style={{"background-color": "#4B515D"}}>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                    <div className="card-body p-4">
                                        <div className="d-flex">
                                        <h6 className="flex-grow-1">ODUKPANI G.S</h6>
                                        <h6>15:07</h6>
                                        </div>
                                        <div className="d-flex flex-column text-center mt-5 mb-4">
                                        <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                        <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                        <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                            <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                            </span></div>
                                            <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                            </div>
                                            <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                            </div>
                                        </div>
                                        <div>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                            width="100px"/>
                                        </div>
                                        {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">OKPAI G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">OMOTOSHO GAS G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div className="row d-flex py-3 justify-content-center align-items-center">
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">OLORUNSOGO NIPP G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">AFAM VI G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-8 col-lg-6 col-xl-4">
                                <div className="card" style={{"color": "#4B515D", "border-radius": "35px"}}>
                                <div className="card-body p-4">
                                    <div className="d-flex">
                                    <h6 className="flex-grow-1">AZURA-EDO IPP G.S</h6>
                                    <h6>15:07</h6>
                                    </div>
                                    <div className="d-flex flex-column text-center mt-5 mb-4">
                                    <h6 className="display-4 mb-0 font-weight-bold" style={{"color": "#1C2331"}}> 13°C </h6>
                                    <span className="small" style={{"color": "#868B94"}}>Stormy</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                    <div className="flex-grow-1" style={{"fontSize": "1rem"}}>
                                        <div><i className="fas fa-wind fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 40 km/h
                                        </span></div>
                                        <div><i className="fas fa-tint fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 84% </span>
                                        </div>
                                        <div><i className="fas fa-sun fa-fw" style={{"color": "#868B94"}}></i> <span className="ms-1"> 0.2h </span>
                                        </div>
                                    </div>
                                    <div>
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                                        width="100px"/>
                                    </div>
                                    {/* {https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu3.webp -- Sunny} */}
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={this.next}>Next</button>
                            <button onClick={this.previous}>Previous</button>
                        </div>
                    </div>
                    <div className="col-3 border border-3">
                        <div>
                            <h3 className="weather_h3 text-center">Weather Forecast</h3>
                            <ul className="weather_ul">
                                <li><marquee width="100%" height="30" direction="left" scrollamount="4" scrolldelay="10">EXPECT LIGHT SHOWERS AT ODUKPANI BETWEEN 1200-1400HRS</marquee></li>
                                <li><marquee width="100%" height="30" direction="left" scrollamount="4"> Clear Skies at Okpai all day </marquee></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                
            </section>
        )
    }
}
export default withRouter(WeatherWidget_cards);
