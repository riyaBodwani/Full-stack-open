const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist')))

// 3.8 - Custom Morgan token for request body
morgan.token('body', request => {
  return JSON.stringify(request.body)
})

// 3.7 + 3.8 - Morgan logging
app.use(
  morgan((tokens, request, response) => {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length'),
      '-',
      tokens['response-time'](request, response),
      'ms',
      tokens.body(request, response)
    ].join(' ')
  })
)

let persons = [
  {
    id: '1',
    name: 'Riya Bodwani',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Meet Phulwani',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Sanskruti Supekar',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Tejas Sinnurkar',
    number: '39-23-6423122'
  }
]

// 3.1 - Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2 - Info page
app.get('/info', (request, response) => {
  const currentTime = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `)
})

// 3.3 - Get one person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// 3.4 - Delete one person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const personExists = persons.some(
    person => person.id === id
  )

  if (!personExists) {
    return response.status(404).end()
  }

  persons = persons.filter(
    person => person.id !== id
  )

  response.status(204).end()
})

// 3.5 + 3.6 - Add a new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const nameExists = persons.some(
    person =>
      person.name.toLowerCase() ===
      body.name.toLowerCase()
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: Math.floor(
      Math.random() * 1000000000
    ).toString(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})