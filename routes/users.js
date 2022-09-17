const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
// const User = require('../models/user')
const { User } = require('../mongo')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs',
    { url: 1, title: 1, author: 1, id: 1 }
  )
  res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    })
  }

  if (!password || password.length < 3) {
    return res.status(400).json({
      error: 'password must be not empty & longer than the minimum allowed length (3).'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter