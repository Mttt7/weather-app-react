import logo from './logo.svg';
import './App.css';
import {useState, useEffect, useRef} from 'react'
import githubLogo from './gitlogo.png'
import yourweatherImage from './yourweather.gif'
import sadCloud from './sadcloud.gif'
import sun from './sun.gif'
import React from 'react';


function WeatherCard({city, unit, cities,setCities,index, indexes,setIndexes}){

  
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
    return await fetch(`https://api.pexels.com/v1/search?query=${city.cityName}&page=${1}`, 
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
      console.log('No such image')
    })
    

  }

  async function fetchWeather(city){
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.cityName}&appid=27e1317dd7a01c91b570e159116336c3`)
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
      console.log('No such city')
    })
    
  }
  React.useEffect(()=>{
    setWeather(fetchWeather(city))
    fetchImage(city)
  },[])


  function handleDoubleClick(e){
    const keyToDel=e.target.parentNode.dataset.key
    setCities(cities.filter(c=>{return c.cityName!==keyToDel}))
    setIndexes(indexes.filter(i=>i!==city.index))
  }

  function applyLength(str){
    try{
      if(str.length > 14){
      return city.cityName
      }
    }
    catch(e){
    }
    return str
  }
  if(weather!==null){
    return(
          <div className='weather-card'  data-key={city.cityName} onDoubleClick={handleDoubleClick} style={{backgroundImage: `url("${weatherImg}")`}}>
            <div className='city-name'>{applyLength(weather.city)}</div>
            <div className='current-temp'>{unit==='f' ? convertToFahrenheit(weather.temp): convertToCelsius(weather.temp)}</div>
            <div className='min-temp'>min: {unit==='f' ? convertToFahrenheit(weather.tempMin): convertToCelsius(weather.tempMin)}</div>
            <div className='max-temp'>max: {unit==='f' ? convertToFahrenheit(weather.tempMax): convertToCelsius(weather.tempMax)}</div>
            <div className='wind-speed'>💨: {weather.windSpeed} m/s</div>
         </div>
    )
  }
  
}






function AddWeatherCard({addCity, cities, cityExists}){
  const [name,setName] = useState('')

  function handleChange(e){
    const newName = e.target.value
    
    setName(()=>{
      return newName
    })
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      setName('')
      if(cities.length>0){
        let unique = true
        cities.forEach(c => {
          if(c.cityName===name){
            unique = false
          }
        });
        if(unique) addCity(name)
        else cityExists(name)
      }else{
        addCity(name)
      }
    }
  }

  const inputRef = useRef(null)

  React.useEffect(()=>{

    setInterval(changePlaceholder,3500)

  },[])

  
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function changePlaceholder(){
    const cities = [
      'Texas',
      'Oklahoma',
      'Madrid',
      'Barcelona',
      'Sydney',
      'Pretoria',
      'Oslo',
      'Toronto',
      'Berlin',
      'Warsaw',
      'Puerto Rico',
      'New Delhi',
      'Abu Zabi',
      'Reykjavík',
      'Antalya'
    ]
    try{
      inputRef.current.placeholder = cities[getRandomInt(15)]
    }catch(e){}
    
  }

  return(
    <div className='add-weather-card'>
      <input type='text'  ref={(element)=>{inputRef.current = element}} placeholder="" value={name} onChange={handleChange} onKeyPress={handleKeyPress}/>
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



function Header(){
  function handleLogoClick(e){
    if(e.target.dataset.logo==='normal'){
      e.target.dataset.logo='sad'
      e.target.src=sadCloud
    }else if(e.target.dataset.logo==='sad'){
      e.target.dataset.logo='sun'
      e.target.src=sun
    }else if(e.target.dataset.logo==='sun'){
      e.target.dataset.logo='normal'
      e.target.src=yourweatherImage
    }
    
  }
    
  return(
    <div className='header'> 
      
      <div className='logo'> 
        <img onClick={handleLogoClick} data-logo="normal" src={yourweatherImage}/> 
        <div className='text'> Weather-app</div>
        <img onClick={handleLogoClick}  data-logo="normal"src={yourweatherImage}/> 
      </div>

    </div>
  )

}
function Footer(){


  return(
    <div className='footer'>
       <div className='cred'>
        by mt, using <a href="https://openweathermap.org/">openWeather</a> and <a href="https://www.pexels.com/">Pexels</a> API
      </div>
      <div className='github-link'><a href="https://github.com/Mttt7/weather-app-react"><img src={githubLogo}/></a></div>
    </div>
  )
}

export default function App() {
  const [cities, setCities] = useState([{index:0, cityName:'Lublin'}])
  const [unit, setUnit] = useState('c')
  const [indexes, setIndexes] = useState([])

  function getIndex(){
    let ind = 0
    for(let i = 0;i<indexes.length;i++){
      if(indexes[i]!==i){ 
        setIndexes(...indexes, i)
        setIndexes.sort()
        return i
      }
    }
    return indexes.length
  }

  function changeUnit(u){
    
    if(u==='c') setUnit('c')
    else if(u==='f') setUnit('f')
  }

  function handleCityAdded(name){
    setCities(()=>{
      return [ {index:getIndex, cityName:name}, ...cities]
    })
  }
  function handleDuplicate(name){
    console.log(`${name} already exists!`)
  }

  return (
    <div className='container'>
      <Header />
      <AddWeatherCard  addCity={handleCityAdded} cityExists={handleDuplicate} cities={cities}/>
      <CurrentUnit changeUnit={changeUnit}/>       
      <div className='cities-container' >
        {cities.map((c,index)=>{
           return(
            <WeatherCard indexes={indexes} setIndexes={setIndexes} index={index} cities={cities} setCities={setCities} key={c.cityName} unit={unit} city={c}/>
          )
        })} 
      </div>  
      <Footer></Footer>                       
    </div>
  )
}


