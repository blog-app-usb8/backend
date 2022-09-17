const blogsRouter = require('express').Router()
const { Blog } = require('../mongo')

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

module.exports = blogsRouter