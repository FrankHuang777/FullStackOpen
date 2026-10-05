import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCca3, setSelectedCca3] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setSelectedCca3(null)
  }

  const matches = searchTerm === ''
    ? []
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const selectedCountry = countries.find(country => country.cca3 === selectedCca3)

  return (
    <div>
      find countries <input value={searchTerm} onChange={handleSearchChange} />

      {selectedCountry
        ? <CountryDetail country={selectedCountry} />
        : matches.length > 10
          ? <p>Too many matches, specify another filter</p>
          : matches.length === 1
            ? <CountryDetail country={matches[0]} />
            : (
              <ul>
                {matches.map(country =>
                  <li key={country.cca3}>
                    {country.name.common}
                    <button onClick={() => setSelectedCca3(country.cca3)}>
                      show
                    </button>
                  </li>
                )}
              </ul>
            )
      }
    </div>
  )
}

export default App
