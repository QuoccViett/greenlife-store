const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GreenLife API đang chạy!' })
})

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB đã kết nối'))
  .catch(err => console.log('Lỗi kết nối:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`))

