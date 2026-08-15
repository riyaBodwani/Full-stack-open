import { useEffect, useState } from 'react'
import axios from 'axios'
import Notification from './Notification'
import PersonForm from './PersonForm'

const baseUrl = 'http://localhost:3000/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type) => {
    setNotification({
      message,
      type
    })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setPersons(response.data)
      })
      .catch(() => {
        showNotification(
          'Failed to load phonebook',
          'error'
        )
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      axios
        .put(
          `${baseUrl}/${existingPerson.id}`,
          updatedPerson
        )
        .then(response => {
          setPersons(
            persons.map(person =>
              person.id === existingPerson.id
                ? response.data
                : person
            )
          )

          setNewName('')
          setNewNumber('')

          showNotification(
            `Updated ${newName}`,
            'success'
          )
        })
        .catch(error => {
          if (
            error.response &&
            error.response.status === 404
          ) {
            showNotification(
              `${newName} was already deleted from the phonebook`,
              'error'
            )

            setPersons(
              persons.filter(
                person => person.id !== existingPerson.id
              )
            )
          } else {
            showNotification(
              `Failed to update ${newName}`,
              'error'
            )
          }
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    axios
      .post(baseUrl, personObject)
      .then(response => {
        setPersons(persons.concat(response.data))

        setNewName('')
        setNewNumber('')

        showNotification(
          `Added ${newName}`,
          'success'
        )
      })
      .catch(() => {
        showNotification(
          `Failed to add ${newName}`,
          'error'
        )
      })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return
    }

    axios
      .delete(`${baseUrl}/${id}`)
      .then(() => {
        setPersons(
          persons.filter(person => person.id !== id)
        )

        showNotification(
          `Deleted ${name}`,
          'success'
        )
      })
      .catch(error => {
        if (
          error.response &&
          error.response.status === 404
        ) {
          showNotification(
            `${name} was already deleted`,
            'error'
          )

          setPersons(
            persons.filter(person => person.id !== id)
          )
        } else {
          showNotification(
            `Failed to delete ${name}`,
            'error'
          )
        }
      })
  }

  const personsToShow = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <div className="filter">
        <label>
          Filter shown with
          <input
            value={filter}
            onChange={event =>
              setFilter(event.target.value)
            }
          />
        </label>
      </div>

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <div className="persons">
        {personsToShow.map(person => (
          <div
            className="person"
            key={person.id}
          >
            <span className="person-name">
              {person.name}
            </span>

            <span className="person-number">
              {person.number}
            </span>

            <button
              onClick={() =>
                deletePerson(
                  person.id,
                  person.name
                )
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Appc
