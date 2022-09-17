const mongoose = require('mongoose')
const Blog = require('./models/Blog')
const User = require('./models/User')
const { MONGO_URI } = require('../utils/config')

if (MONGO_URI && !mongoose.connection.readyState) mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = {
  Blog,
  User
}