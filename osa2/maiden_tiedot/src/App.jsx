import { useState, useEffect } from 'react'
import axios from "axios"

const CountryForm = (props) => (
    <form>
        <div>
          find countries<input value={props.country}
          onChange={props.handleCountry}/>
        </div>
    </form>
)

const Weather = (props) => {
  if (props.weather.length === 0) return null

    return (
      <div>
        <h2>Weather in {props.weather.name}</h2>

        Temperature {props.weather.main.temp} Celsius
        <br/>
        <img 
          src={`https://openweathermap.org/img/wn/${props.weather.weather[0].icon}.png`}
        />
        <br/>
        Wind {props.weather.wind.speed} m/s
      </div>
  )}


const Information = (props) => {
  if (props.countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if (props.countries.length === 1) {
    const country = props.countries[0]
    const weather_key = import.meta.env.VITE_WEATHER_KEY

    useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.name.common}&appid=${weather_key}&units=metric`)
      .then(response => {
        props.setWeather(response.data)
      })
  }, [props.countries])

    return (
      <div>
        <h1>{country.name.common}</h1>

        Capital {country.capital}
        <br/>
        Area {country.area}

        <h2>Languages</h2>
        
        <ul>
          {Object.entries(country.languages).map(([id, lang]) =>
            <li key={id}> {lang}</li>
          )}
        </ul>

        <img src={country.flags.png}/>

        <Weather weather={props.weather}/>

      </div>
    )
  }

  return (
    <ul>
      {props.countries.map(country =>
        <li key={country.cca2}> {country.name.common} <button onClick={() => props.edit(country.name.common)}>Show</button></li>
      )}
    </ul>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setCountry] = useState('')
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter ((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  const handleCountry = (event) => {
    setCountry(event.target.value)
  }

  return (
    <div>
      <CountryForm country={filter} handleCountry={handleCountry}/>

      <Information countries={countriesToShow} edit={setCountry} weather={weather} setWeather={setWeather}/>
    </div>
    )  
  }
export default App