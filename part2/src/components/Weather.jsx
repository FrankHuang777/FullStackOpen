import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey || !capital) return

    axios
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: capital,
          appid: apiKey,
          units: 'metric'
        }
      })
      .then(response => {
        setWeather(response.data)
      })
      .catch(() => {
        setWeather(null)
      })
  }, [capital])

  if (!weather) return null

  const iconCode = weather.weather[0].icon

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
