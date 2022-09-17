const blogsRouter = require('express').Router()
const { Blog } = require('../mongo')

blogsRouter.get('/', async (_req, res) => {
  // const blogs = await Blog.find({})
  const blogs =  await Blog.find({}).populate('user',
    { username: 1, name: 1, id: 1 }
  )
  res.json(blogs)
})

module.exports = blogsRouter