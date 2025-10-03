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

      </div>
    )
  }

  return (
    <ul>
      {props.countries.map(country =>
        <li key={country.cca2}> {country.name.common}</li>
      )}
    </ul>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setCountry] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter ((country) => country.name.common.toLowerCase().includes(filter))

  const handleCountry = (event) => {
    setCountry(event.target.value)
  }

  return (
    <div>
      <CountryForm country={filter} handleCountry={handleCountry}/>

      <Information countries={countriesToShow}/>
    </div>
    )  
  }
export default App