const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

morgan.token('data', function (req, res) {
  if(req.method === 'POST') return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/', (request, response) => {
  response.send('<h3>Proceed to /api/persons to see the list</h3>')
})
app.get('/info', (request, response) => {
  const length = persons.length
  response.send(`<p>Phonebook has info for ${length} people </p><p>${new Date()}</p>`)
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const result = persons.find(person => person.id === id)

  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const newId = Math.floor(Math.random() * 10000)
  console.log(request.body)
  const person = request.body
  if (!person.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!person.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  } else if (persons.filter(item => item.name === person.name).length > 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const newPerson = { id: newId, name: person.name, number: person.number}
  persons = persons.concat(newPerson)
  response.send(request.body)
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})