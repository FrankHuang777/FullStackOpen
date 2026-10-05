import { useState, useEffect, useRef } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeoutRef = useRef(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    setNotification({ message, type })
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!confirmUpdate) return

      const changedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person =>
            person.id !== existingPerson.id ? person : returnedPerson
          ))
          showNotification(`Updated ${newName}'s number`)
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          showNotification(
            `Information of ${newName} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${newName}`)
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (!confirmDelete) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const personsToShow = searchTerm === ''
    ? persons
    : persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification?.message} type={notification?.type} />
      <Filter searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
