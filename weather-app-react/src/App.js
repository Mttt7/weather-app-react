import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react'
import React from 'react';


function WeatherCard({city, unit, cities,setCities}){

  
  const [weather, setWeather] = useState({
    city:'',
    temp:'',
    tempMax:'',
    tempMin:'',
    windSpeed:''
  })

  const [weatherImg, setWeatherImg] = useState('https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')

  function convertToCelsius(temp){
      return Math.floor((temp-273.15)*10)/10 + '°C'
  }

  function convertToFahrenheit(temp){
    return Math.floor(((temp - 273.15) * 9/5 + 32) * 10) / 10 + '°F';
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
      if(data.photos.length!==0){
        setWeatherImg(data.photos[0].src.original)
      }
    }).catch((error)=>{
      console.log(error)
    })
    

  }

  async function fetchWeather(city){
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=27e1317dd7a01c91b570e159116336c3`)
    .then((response)=>{
      return response.json()
    })
    .then((data)=>{
      if(data.cod!=='404'){
        const weather = {city:data.name, temp:data.main.temp, tempMax:data.main.temp_max, tempMin: data.main.temp_min, windSpeed:data.wind.speed}
        setWeather(weather)
      }else{
        setWeather(null)
      }
    })
    .catch((error)=>{
      console.log(error)
    })
    
      
    
  }
  React.useEffect(()=>{
    setWeather(fetchWeather(city))
    fetchImage(city)
  },[])



  if(weather!==null){
    return(
      <div className='weather-card'  style={{backgroundImage: `url("${weatherImg}")`}}>
          <div className='city-name'>{weather.city}</div>
          <div className='current-temp'>{unit==='f' ? convertToFahrenheit(weather.temp): convertToCelsius(weather.temp)}</div>
          <div className='min-temp'>min: {unit==='f' ? convertToFahrenheit(weather.tempMin): convertToCelsius(weather.tempMin)}</div>
          <div className='max-temp'>max: {unit==='f' ? convertToFahrenheit(weather.tempMax): convertToCelsius(weather.tempMax)}</div>
          <div className='wind-speed'>💨: {weather.windSpeed} m/s</div>
          
      </div>
    )
  }
  
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

  const inputRef = useRef(null)

  React.useEffect(()=>{

    setInterval(changePlaceholder,3500)

  },[])
  let cityIterator = 0


  function changePlaceholder(){
    const cities = [
      'Madrit',
      'Barcelona',
      'Sydney',
      'Oslo',
      'Toronto',
      'Berlin',
      'Warsaw',
      'Porto Rico',
      'New Delhi'
    ]
    
    if(cityIterator===cities.length-1) cityIterator=0
    inputRef.current.placeholder = cities[cityIterator]
    cityIterator++
     
  }

  return(
    <div className='add-weather-card'>
      <input type='text'  ref={(element)=>{inputRef.current = element}} placeholder="" value={city} onChange={handleChange} onKeyPress={handleKeyPress}/>
    </div>
  )
}


function CurrentUnit({changeUnit}){
  const [currentUnit, setCurrentUnit] = useState('c')

  function handleClick(){
    if(currentUnit==='c'){
      setCurrentUnit('f')
      changeUnit('f')
    }else if(currentUnit==='f'){
      setCurrentUnit('c')
      changeUnit('c')
    }
  }
 

  return(
  <div onClick={handleClick} className='change-units'>
      <div className='current-unit'> °{currentUnit.toUpperCase()}</div>
  </div>
  )
}


export default function App() {
  const [cities, setCities] = useState([])
  const [unit, setUnit] = useState('c')

  function changeUnit(u){
    if(u==='c') setUnit('c')
    else if(u==='f') setUnit('f')
  }

  function handleCityAdded(city){
    setCities(()=>{
      return [ city, ...cities]
    })
  }
  function handleDuplicate(city){
    console.log(`${city} already exists!`)
  }

  return (
   <div className='container'>
    <AddWeatherCard  addCity={handleCityAdded} cityExists={handleDuplicate} cities={cities}/>
    <CurrentUnit changeUnit={changeUnit}/>

    
    {cities.map(c=>{
      return(<WeatherCard cities={cities} setCities={setCities} key={c} unit={unit} city={c}/>)
    })}

   </div>
  )
}


