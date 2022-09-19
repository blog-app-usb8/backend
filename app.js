const express = require('express')
const app = express()
const cors = require('cors')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

logger.info('------ connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('------ connected to MongoDB')
  })
  .catch((error) => {
    logger.error('------ error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

const usersRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const blogsRouter = require('./routes/blogs')
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app