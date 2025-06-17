const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000


app.use(express.json())

// Basic route example
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// API route example
app.get('/api/users', (req, res) => {
  res.json({ users: ['John', 'Jane'] })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
