const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
require('dotenv').config()

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

morgan.token('data', function (req, res) {
  if(req.method === 'POST') return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.get('/', (request, response) => {
  response.send('<h3>Proceed to /api/persons to see the list</h3>')
})
app.get('/info', (request, response) => {
  const length = persons.length
  response.send(`<p>Phonebook has info for ${length} people </p><p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })

})

app.delete('/api/persons/:id', (request, response) => {
  const requestId = request.params.id
  Person.deleteOne({ id: requestId })
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  } else {
    Person.count({ name: body.name }).then(count => {
      if (count > 0) return response.status(400).json({
        error: 'name must be unique'
      })
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedNumber => {
    response.json(savedNumber)
  })
})

