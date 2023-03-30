import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'
import React from 'react';


function WeatherCard({city}){

  const [weather, setWeather] = useState({
    city:'',
    temp:'',
    tempMax:'',
    tempMin:'',
    windSpeed:''
  })

  const [weatherImg, setWeatherImg] = useState('https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')

  function convertToCelsius(temp){
      return Math.floor((temp-273.15)*10)/10
  }



  async function fetchImage(city){
    return await fetch(`https://api.pexels.com/v1/search?query=${city}&page=${1}`, 
    {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: 'v6wCb15yxRzUiBUEqNZmUSrMNUVk9rF5lcp3i1nRgw5sAPS1FAOh4NcU',
        },
    })
    .then(response=>{
        return response.json()
    })
    .then(data=>{
      setWeatherImg(data.photos[0].src.original)
    })

  }

  async function fetchWeather(city){
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=27e1317dd7a01c91b570e159116336c3`)
    .then((response)=>{
      return response.json()
    })
    .then((data)=>{
      
      const weather = {city:data.name, temp:data.main.temp, tempMax:data.main.temp_max, tempMin: data.main.temp_min, windSpeed:data.wind.speed}
      setWeather(weather)
    })
    
      
    
  }
  React.useEffect(()=>{
    setWeather(fetchWeather(city))
    fetchImage(city)
  },[])


  return(
    <div className='weather-card' style={{backgroundImage: `url("${weatherImg}")`}}>
        <div className='city-name'>{weather.city}</div>
        <div className='current-temp'>{convertToCelsius(weather.temp)}℃</div>
        <div className='min-temp'>min: {convertToCelsius(weather.tempMin)}℃</div>
        <div className='max-temp'>max: {convertToCelsius(weather.tempMax)}℃</div>
        <div className='wind-speed'>💨: {weather.windSpeed}</div>
        
    </div>
  )
}

function AddWeatherCard({addCity,cities, cityExists}){
  const [city,setCity] = useState('')

  function handleChange(e){
    const city = e.target.value
    setCity((prev)=>{
      return city
    })
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      console.log(cities.length)
      if(cities.length>0){
        let unique = true
        cities.forEach(c => {
          if(c===city){
            unique = false
          }
        });
        if(unique) addCity(city)
        else cityExists(city)
      }else{
        addCity(city)
      }
      
      
    }
  }

  return(
    <div className='add-weather-card'>
      <input type='text' placeholder="" value={city} onChange={handleChange} onKeyPress={handleKeyPress}/>
    </div>
  )
}





export default function App() {
  const [cities, setCities] = useState([])

  function handleCityAdded(city){
    setCities(()=>{
      return [...cities, city]
    })
  }
  function handleDuplicate(city){
    console.log(`${city} already exists!`)
  }

  return (
   <div className='container'>
    <div>CELSIUS / FAHRENEIT</div>
    <AddWeatherCard addCity={handleCityAdded} cityExists={handleDuplicate} cities={cities}/>
    {cities.map(c=>{
      return(<WeatherCard key={c} city={c}/>)
    })}

   </div>
  )
}


