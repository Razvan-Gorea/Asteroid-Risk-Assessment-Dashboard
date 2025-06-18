require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

const port = process.env.PORT || 3000
const api_key = process.env.NASA_API_KEY

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://asteroid-risk-assessment-dashboard.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())

// Routes

// Base route
app.get('/', (req, res) => {
  res.send('Custom API')
})

// Get Near Earth Objects for today
app.get('/neo/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${api_key}`
    )
    
    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`)
    }
    
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching NEO data:', error)
    res.status(500).json({ error: 'Failed to fetch NEO data' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})