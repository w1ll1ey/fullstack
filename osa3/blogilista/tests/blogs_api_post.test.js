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

test('a valid blog object can be added', async () => {
    const newBlog = {
        title: "Presidentin elämää 5",
        author: "Alex Stubbi",
        url: "http://www.alexstubbi.fi/inflensser/antreprenuuialmind",
        likes: 6224
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsinDB()
    assert.strictEqual(blogsAfterAdding.length, helper.testBlogs.length + 1)

    const contents = blogsAfterAdding.map(n => n.title)
    assert(contents.includes('Presidentin elämää 5'))


})

after(async () => {
    await mongoose.connection.close()
})