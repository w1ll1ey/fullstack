const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.testBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('api returns the right amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.testBlogs.length)
})

test.only('api returns blogs with an identifier called id', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect(response => {
            response.body.forEach(blog => {
                assert.ok(blog.id)
            })
        })
})

after(async () => {
    await mongoose.connection.close()
})