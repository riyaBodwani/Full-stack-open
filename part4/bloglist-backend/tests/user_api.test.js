const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

test('a valid user can be created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'riya',
      name: 'Riya',
      password: 'secret'
    })
    .expect(201)
})

test('password is not stored as clear text', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'riya',
      name: 'Riya',
      password: 'secret'
    })
    .expect(201)

  const user = await User.findOne({ username: 'riya' })

  assert.notStrictEqual(user.passwordHash, 'secret')
})

test('invalid user is not created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'ri',
      name: 'Riya',
      password: 'se'
    })
    .expect(400)

  const users = await User.find({})

  assert.strictEqual(users.length, 0)
})

test('username must be unique', async () => {
  const user = {
    username: 'riya',
    name: 'Riya',
    password: 'secret'
  }

  await api
    .post('/api/users')
    .send(user)
    .expect(201)

  await api
    .post('/api/users')
    .send(user)
    .expect(400)
})

test('users are returned as json', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'riya',
      name: 'Riya',
      password: 'secret'
    })
    .expect(201)

  const response = await api
    .get('/api/users')
    .expect(200)

  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].username, 'riya')
  assert.strictEqual(response.body[0].passwordHash, undefined)
})

test('user has blogs', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'riya',
      name: 'Riya',
      password: 'secret'
    })
    .expect(201)

  await api
    .post('/api/blogs')
    .send({
      title: 'Riya Blog',
      author: 'Riya',
      url: 'https://example.com',
      likes: 5
    })
    .expect(201)

  const response = await api.get('/api/users')

  assert.strictEqual(response.body[0].blogs.length, 1)
  assert.strictEqual(response.body[0].blogs[0].title, 'Riya Blog')
})

after(async () => {
  await mongoose.connection.close()
})