const express = require('express')
const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')

const mongoose = require('mongoose')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

logger.info('------ connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('------ connected to MongoDB')
  })
  .catch((error) => {
    logger.error('------ error connection to MongoDB:', error.message)
  })

const blogsRouter = require('./routes/blogs')
app.use('/api/blogs', blogsRouter)

module.exports = app