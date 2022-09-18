const logger = require('./logger')
const jwt = require('jsonwebtoken')
// const User = require('../models/user')
const { User } = require('../mongo')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('------')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  // console.log('----------------------', error.name)

  /* eslint-disable */
  switch (error.name) {
    case 'CastError':
      return res.status(400).send({ error: 'malformatted id' })
    case 'ValidationError':
      return res.status(400).json({ error: error.message })
    case 'JsonWebTokenError':
      return res.status(401).json({ error: 'invalid token' })
    case 'TokenExpiredError':
      return res.status(401).json({ error: 'token expired' })
  }
  /* eslint-enable */

  next(error)
}

// const tokenExtractor = (req, res, next) => {
//   const authorization = req.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     req.token = authorization.substring(7)
//   } else {
//     return res.status(401).json({ error: 'token missing' })
//   }
//   next()
// }

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try { // NOTE: invalid token right here --> middleware userExtractor cause err before ... before errorHandler middleware
      const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
      req.user = await User.findById(decodedToken.id)
      next()
    } catch(err) {
      next(err)
    }
  }
  else {
    return res.status(401).json({ error: 'token missing' })
  }
}

module.exports = {
  requestLogger,
  // tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}