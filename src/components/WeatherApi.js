import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

function WeatherApi({tickets}) {
    const history = useHistory();    
    // const queryParams = new URLSearchParams(history.location.search);
    // const index = queryParams.get("key");
    // const appr_no = queryParams.get("appr")
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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`;
    console.log(url, " the url");
    fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    },
    })
    .then(res => res.json())
    .then((response) => {
        console.log(response, "this is the response");
        // Note that the weather is return in Kelvin
        // Subtract 273.15 from the resulting temperature to 
        // get its actual value


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
    <div className='container'>
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
                    Select Station
                    <select required onChange={e => setStation(e.target.value) } >
                        <option selected disabled value="Select Station">Select Station</option>
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
            <label className='disco_form_label'>                    
                
            </label>
            <label className='disco_form_label'>                    
                
            </label>
            <label className='disco_form_label'>                    
                
            </label>
            <label className='disco_form_label'>                    
                
            </label>
            <label className='disco_form_label'>                    
                
            </label>
            <label className='disco_form_label'>                    
                
            </label>
            <label className='disco_form_label'>                    
                
            </label>
            
        </div>
    </div>
  );
}
export default WeatherApi;
