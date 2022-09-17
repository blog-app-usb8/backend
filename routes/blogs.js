const blogsRouter = require('express').Router()
// const Blog = require('../models/blog')
const { Blog } = require('../mongo')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (_req, res) => {
  // const blogs = await Blog.find({})
  const blogs =  await Blog.find({}).populate('user',
    { username: 1, name: 1, id: 1 }
  )
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  }
  catch(error) {
    next(error)
  }
})

blogsRouter.put('/:id', (req, res, next) => {
  const { title, author, url, likes } = req.body

  Blog
    .findByIdAndUpdate(
      req.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedBlog => {
      if (updatedBlog) { res.status(200).json(updatedBlog) }
      else { res.status(404).end() }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  const body = req.body
  
  const user = req.user

  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = [savedBlog._id, ...user.blogs]
    await user.save()

    res.status(201).json(savedBlog)
  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter