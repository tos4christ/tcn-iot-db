import React, { useState, useEffect } from 'react';
import WeatherWidget from './Weather/WeatherWidget';

function WeatherApi() {
    const cordinates = {
        Aba: {longitude: 7.35582222222222, latitude: 5.09995555555555},
        Abeokuta: {longitude: 3.3908055555084, latitude: 7.10401944510485},
        Ajah: {longitude: 3.57112222222222, latitude: 6.47070833333333}
    }
    const apiKey = 'd92e84063dd0e4bfdb345d4cad0c9c66';
    const [current_display, setCurrent] = useState(false);
    const [forecast_display, setForecast] = useState(false);
    const [historical_display, setHistorical] = useState(false);
    const [long, setLong] = useState(0);
    const [lat, setLat] = useState(0);
    const [station_name, setStationName] = useState(null);
    const [weather_main, setWeatherMain] = useState(null);
    const [weather_description , setWeatherDescription] = useState(null);
    const [temp, setTemp] = useState(null);
    const [feels_like, setFeelsLike] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [pressure, setPressure] = useState(null);
    const [wind_speed, setWindSpeed] = useState(null);
    const [wind_degree, setWindDegree] = useState(null);
    const [wind_gust, setWindGust] = useState(null);
    const [weather_date, setWeatherDate] = useState(null);
 
  useEffect(() => {
        // if(Array.isArray(tickets) && tickets.length > 0) {
        //     formData = tickets[index];
        //     setComment(formData.comment);
        //     setStation(formData.station);
        //     setEquipment(formData.equipment);
        //     setPriority(formData.priority);
        //     setDisco(formData.disco);
        //     setticketId(formData.ticket_id);
        // }    
    });
  function getWeather(e) {
    e.preventDefault();
    const url_1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
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
        setStationName(weather.name);
        setWeatherMain(weather.weather[0].main);
        setWeatherDescription(weather.weather[0].description);
        setTemp(weather.main.temp);
        setFeelsLike(weather.main.feels_like);
        setHumidity(weather.main.humidity);
        setPressure(weather.main.pressure);
        setWindSpeed(weather.wind.speed);
        setWindDegree(weather.wind.deg);
        setWindGust(weather.wind.gust);
        setWeatherDate(weather.dt);
    })
    .catch((error) => console.error(error.message));
}
  const setStation = (value) => {
    //e.preventDefault();
    const coords = cordinates[value];
    setLong(coords.longitude);
    setLat(coords.latitude);
  }
 
  return (
    <div className='container-fluid'>
        <div className='row dashboard'>
            <button onClick={() => {                
                setCurrent(!current_display);
                if(!current_display) {
                    setForecast(false);
                    setHistorical(false);
                }
            }}>
                Get Current Weather
            </button>
            <button onClick={() => {                
                setForecast(!forecast_display);
                if(!forecast_display) {
                    setCurrent(false);
                    setHistorical(false);
                }
            }}>
                Get Weather Forecast
            </button>
            <button onClick={() => {                
                setHistorical(!historical_display);
                if(!historical_display) {
                    setCurrent(false);
                    setForecast(false);
                }
            }}>
                Download Historical Data
            </button>
        </div>
        <div style={{display: current_display ? '' : 'none'}} className='row current'>
            <form onSubmit={getWeather} >
                <label className='disco_form_label'>
                    <span className='label-span'>Select Station</span>
                    <select defaultValue={"Select Station"} required onChange={e => setStation(e.target.value) } >
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
        <div style={{display: forecast_display ? '' : 'none'}} className='row forecast'>
            
        </div>
        <div style={{display: historical_display ? '' : 'none'}} className='row historical'>
  
        </div>
        <div className='row display'>
           { !station_name ? '' : ( <div className='weather_display'>
            <h1> Station Name: {  station_name  }</h1>
            <label className='weather_label'>                    
                <span> Main weather: {  weather_main  }  </span>
                <span> Weather Description: {  weather_description  } </span>
            </label>
            <label className='weather_label'>                    
                <span> Current Temperature: {  (Number(temp) - 273.15).toFixed(2)  } Celsius</span>
                <span> Room Temperature feels like: {  (Number(feels_like) - 273.15).toFixed(2)  } Celcius</span>
            </label>
            <label className='weather_label'>                    
                <span>Humidity: {  humidity  }</span>
                <span>Pressure: {  pressure  }</span>
            </label>
            <label className='weather_label'>                    
                <span> Wind Speed: {  wind_speed  }Km/H </span>
                <span> Wind Degree: {  wind_degree  } degrees</span>
                <span> Wind Gust: {  wind_gust  }</span>
            </label>
            <label className='weather_label'>                    
                Date: {  weather_date  } in epoch Time
            </label> 
            </div>)
            }
        </div>
        <div className='row' style={{width: "165%"}}>
            <WeatherWidget />
        </div>
    </div>
  );
}
export default WeatherApi;
