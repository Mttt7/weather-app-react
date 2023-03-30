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

  async function fetchWeather(city){
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=27e1317dd7a01c91b570e159116336c3`)
    .then((response)=>{
      return response.json()
    })
    .then((data)=>{
      console.log(data)
      const weather = {city:data.name, temp:data.main.temp, tempMax:data.main.temp_max, tempMin: data.main.temp_min, windSpeed:data.wind.speed}
      setWeather(weather)
    })
  }
  React.useEffect(()=>{
    setWeather(fetchWeather(city))
  },[])


  return(
    <div className='weather-card'>{weather.city} {weather.temp} {weather.tempMax} {weather.tempMin} {weather.windSpeed}</div>
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
    <AddWeatherCard addCity={handleCityAdded} cityExists={handleDuplicate} cities={cities}/>
    {cities.map(c=>{
      return(<WeatherCard key={c} city={c}/>)
    })}

   </div>
  )
}


