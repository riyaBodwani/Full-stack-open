require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist')))

// Morgan custom token for request body
morgan.token('body', request => {
  return JSON.stringify(request.body)
})

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

// 3.13 - Get all persons from MongoDB
app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

// 3.2 - Info page
app.get('/info', (request, response) => {
  Person
    .countDocuments({})
    .then(count => {
      const currentTime = new Date()

      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
})

// 3.3 - Get one person
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person
    .findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(() => {
      response.status(400).send({
        error: 'malformatted id'
      })
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(
      request.params.id,
      person,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// 3.4 - Delete one person
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person
    .findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) // Pass the error to the error handling middleware
})

// 3.14 - Add a new person to MongoDB
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

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
})

// Connect to MongoDB first, then start server
const PORT = process.env.PORT || 3001

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
} 

app.use(errorHandler)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })