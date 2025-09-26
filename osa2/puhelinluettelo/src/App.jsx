import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = (props) => (
        <form>
        <div>
          filter shown with<input value={props.filter}
          onChange={props.handleFiltering}/>
        </div>
      </form>
    )

const PersonForm = (props) => (
      <form onSubmit={props.addPerson}>
            <div>
              name: <input value={props.newName}
              onChange={props.handleNameChange}/>
            </div>
            <div>
              number: <input value={props.newNumber}
              onChange={props.handleNumberChange}/>
            </div>
            <div>
              <button type="submit">add</button>
            </div>
          </form>
)

const Persons = (props) => (
      <ul>
        {props.personsToShow.map(person =>
          <li key={person.id}> {person.name} {person.number} <button onClick={() => props.remove(person.id, person.name)}>delete</button></li>
        )}
      </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const personsToShow = persons.filter ((person) => person.name.toLowerCase().includes(filter))

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const same = (person) => person.name === newName

    if (persons.some(same)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    personService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
  }

  const remove = (id, name) => {
    if (confirm(`Delete ${name}?`)) {
    personService
      .remove(id)
        .then(removedPerson => {
          setPersons(persons.filter(p =>
            p.id !== removedPerson.id
          ))
        })}}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFiltering = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter handleFiltering={handleFiltering}/>

      <h3>add a new</h3>
      
      <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson}/>

      <h3>Numbers</h3>
      
      <Persons personsToShow={personsToShow} remove={remove}/>

    </div>
  )

}

export default App