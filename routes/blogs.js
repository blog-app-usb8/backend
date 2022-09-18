const blogsRouter = require('express').Router()
// const Blog = require('../models/blog')
const { Blog, Comment } = require('../mongo')
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
  const editedBlog = req.body
  delete editedBlog.user

  Blog
    .findByIdAndUpdate(
      req.params.id,
      editedBlog,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedBlog => {
      if (updatedBlog) { res.status(200).json(updatedBlog) }
      else { res.status(404).end() }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  const user = req.user

  try {
    const blog = new Blog({
      ...req.body,
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

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).end()
    }

    if ( blog.user.toString() === user.id.toString() ) {
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end()
    } else {
      res.status(401).end('Users can only delete their OWN blogs')
    }
  }
  catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id/comments', async (req, res) => {
  // console.log('-------------',req.params)
  const comments = await Comment.find({ blogId: req.params.id })
  if (comments) {
    res.json(comments)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/:id/comments', async (req, res, next) => {
  const body = req.body

  try {
    const comment = new Comment({
      content: body.content,
      blogId: body.blogId,
    })

    const savedComment = await comment.save()
    res.status(201).json(savedComment)
  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter