const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let user
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('test123', 10)

  user = new User({
    username: 'riya_test',
    name: 'Riya',
    passwordHash
  })

  await user.save()

  token = jwt.sign(
    {
      username: user.username,
      id: user._id
    },
    process.env.SECRET
  )
})

test('a blog can be added with a valid token', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Riya',
    url: 'https://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 1)
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Riya',
    url: 'https://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 0)
})

test('adding a blog fails with 401 if token is invalid', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Riya',
    url: 'https://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer invalidtoken')
    .send(newBlog)
    .expect(401)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs.length, 0)
})

test('blog is associated with the logged in user', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Riya Blog',
      author: 'Riya',
      url: 'https://example.com',
      likes: 5
    })
    .expect(201)

  const blogs = await Blog.find({})

  assert.strictEqual(blogs[0].user.toString(), user._id.toString())

  const updatedUser = await User.findById(user._id)

  assert.strictEqual(updatedUser.blogs.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})