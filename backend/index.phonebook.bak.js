const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

// 3.8: 自定义 token，把请求体序列化后加入日志
morgan.token('body', (request) => JSON.stringify(request.body))

// 3.7: 使用 morgan 记录日志（tiny 格式 + 请求体）
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

// 3.2: 显示请求时间和电话簿条目数
app.get('/info', (request, response) => {
  const time = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${time}</p>`
  )
})

// 3.1: 返回全部电话簿条目
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.3: 返回单个条目，不存在则 404
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// 3.4: 删除单个条目
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// 3.5: 用 Math.random 生成 id，范围足够大以降低重复概率
const generateId = () => {
  return String(Math.floor(Math.random() * 1000000000))
}

// 3.5 + 3.6: 新增条目，校验缺失字段与重名
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
