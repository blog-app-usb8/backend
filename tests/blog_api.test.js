const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

// const helper = require('./test_helper')

// const Blog = require('../models/blog')
// const bcrypt = require('bcrypt')
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')

// let token
// beforeEach(async () => {
//   await User.deleteMany({})

//   const userForToken = {}
//   for (let o of helper.initialUsers) {
//     const passwordHash = await bcrypt.hash(o.password, 10)
//     let userObject = new User({ username: o.username, name: o.name, passwordHash })
//     await userObject.save()
//     userForToken.username = userObject.username
//     userForToken.id = userObject._id.toString()
//   }

//   await Blog.deleteMany({})
//   // await Blog.insertMany(helper.initialBlogs)
//   // NOTE: forEach has some issues with async >>>
//   for (let o of helper.initialBlogs) {
//     o.user = userForToken.id
//     let blogObject = new Blog(o)
//     await blogObject.save()
//   }

//   token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
// })

describe('BLOG_API GET METHOD', () => {
  test('blogs are returned as json', () => {
    api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  // test('all blogs are returned', async () => {
  //   const res = await api.get('/api/blogs')
  //   expect(res.body).toHaveLength(helper.initialBlogs.length)
  // })

  test('a specific blogs is within the returned notes', async () => {
    const res = await api.get('/api/blogs')
    const titles = res.body.map(r => r.title)
    expect(titles).toContain('journal 1')
  })

  test('verify the existence of property _id', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

})


afterAll(() => {
  mongoose.connection.close()
})