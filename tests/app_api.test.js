// describe('hello', () => {
//   it('world', () => {
//     expect(true)
//   })
// })

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('APP_API WORKED', () => {
  test('ping --> pong', async () => {
    const res = await api
      .get('/api/ping')
      .expect(200)
      // .expect('Content-Type', /application\/json/)
    // console.log(res.body) --> {} due to res.send()
    // console.log(res.text) --> pong
    expect(res.text).toContain('pong')
  }, 100000)
})