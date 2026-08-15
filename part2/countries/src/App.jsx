import { useEffect, useState } from 'react'
import axios from 'axios'

const countriesUrl =
  'https://studies.cs.helsinki.fi/restcountries/api/all'

const weatherUrl =
  'https://api.openweathermap.org/data/2.5/weather'

const Country = ({ country, weather, getWeather }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital?.[0]

  return (
    <div className="country">
      <h1>{country.name.common}</h1>

      <p>
        <strong>Capital:</strong> {capital}
      </p>

      <p>
        <strong>Area:</strong> {country.area}
      </p>

      <h3>Languages</h3>

      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        className="flag"
      />

      <h2>Weather in {capital}</h2>

      {weather ? (
        <div className="weather">
          <p>
            <strong>Temperature:</strong>{' '}
            {weather.main.temp} °C
          </p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <p>
            <strong>Wind:</strong>{' '}
            {weather.wind.speed} m/s
          </p>
        </div>
      ) : (
        <button onClick={() => getWeather(capital)}>
          Show weather
        </button>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] =
    useState(null)
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(countriesUrl)
      .then(response => {
        setCountries(response.data)
      })
      .catch(() => {
        setError('Failed to load countries')
      })
  }, [])

  const handleSearch = event => {
    setSearch(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
    setError(null)
  }

  const showCountry = country => {
    setSelectedCountry(country)
    setWeather(null)
    setError(null)
  }

  const getWeather = capital => {
    const apiKey =
      import.meta.env.VITE_WEATHER_API_KEY

      console.log('API Key:', apiKey) // Debugging line to check if the API key is being accessed correctly

    axios
      .get(
        `${weatherUrl}?q=${capital}&appid=${apiKey}&units=metric`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(() => {
        setError('Failed to fetch weather information')
      })
  }

  const matchingCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <h1>Country Search</h1>

      <div className="search">
        <label>
          Find countries:
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search a country..."
          />
        </label>
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {search !== '' &&
        matchingCountries.length > 10 && (
          <p className="message">
            Too many matches, specify another filter
          </p>
        )}

      {search !== '' &&
        matchingCountries.length > 1 &&
        matchingCountries.length <= 10 &&
        !selectedCountry && (
          <div className="country-list">
            {matchingCountries.map(country => (
              <div
                className="country-item"
                key={country.cca3}
              >
                <span>
                  {country.name.common}
                </span>

                <button
                  onClick={() =>
                    showCountry(country)
                  }
                >
                  Show
                </button>
              </div>
            ))}
          </div>
        )}

      {matchingCountries.length === 1 && (
        <Country
          country={matchingCountries[0]}
          weather={weather}
          getWeather={getWeather}
        />
      )}

      {selectedCountry && (
        <Country
          country={selectedCountry}
          weather={weather}
          getWeather={getWeather}
        />
      )}
    </div>
  )
}

export default App