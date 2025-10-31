const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let testUserId

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({username: 'root', passwordHash})
    const savedUser = await user.save()
    testUserId = savedUser._id.toString()

    blogswithUser = helper.testBlogs.map(blog => ({
        ...blog,
        user: testUserId
    }))

    await Blog.insertMany(blogswithUser)
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

test('api returns blogs with an identifier called id', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect(response => {
            response.body.forEach(blog => {
                assert.ok(blog.id)
            })
        })
})

test('a valid blog object can be added', async () => {
    const newBlog = {
        title: "Presidentin elämää 5",
        author: "Alex Stubbi",
        url: "http://www.alexstubbi.fi/inflensser/antreprenuuialmind",
        likes: 6224,
        user: testUserId
    }

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

    const token = loginResponse.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfterAdding = await helper.blogsinDB()
    assert.strictEqual(blogsAfterAdding.length, helper.testBlogs.length + 1)

    const contents = blogsAfterAdding.map(n => n.title)
    assert(contents.includes('Presidentin elämää 5'))
})

test('blog object without likes defaults to 0 likes', async () => {
    const newBlog = {
        title: "Presidentin elämää 5",
        author: "Alex Stubbi",
        url: "http://www.alexstubbi.fi/inflensser/antreprenuuialmind"
    }

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

    const token = loginResponse.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAfterAdding = await helper.blogsinDB()
    const zerolikesBlog = blogsAfterAdding.find(n => n.title === newBlog.title)

    assert.strictEqual(zerolikesBlog.likes, 0)
})

test('blog object without title returns status code 400', async () => {
    const newBlog1 = {
        title: "Presidentin elämää 5",
        url: "http://www.alexstubbi.fi/inflensser/antreprenuuialmind",
        likes: 6224
    }

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

    const token = loginResponse.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog1)
        .expect(400)
})

test('blog object without url returns status code 400', async () => {
    const newBlog2 = {
        title: "Presidentin elämää 6",
        author: "Alex Stubbi",
        likes: 6224
    }

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

    const token = loginResponse.body.token

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog2)
        .expect(400)
})

test('adding blog without a token returns status code 401', async () => {
        const newBlog = {
        title: "Presidentin elämää 5",
        author: "Alex Stubbi",
        url: "http://www.alexstubbi.fi/inflensser/antreprenuuialmind",
        likes: 6224,
        user: testUserId
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const blogsAfterAdding = await helper.blogsinDB()
    assert.strictEqual(blogsAfterAdding.length, helper.testBlogs.length)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsinDB()
    const blogToDelete = blogsAtStart[0]

    const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)

    const token = loginResponse.body.token

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAfterDelete = await helper.blogsinDB()

    const contents = blogsAfterDelete.map(n => n.title)
    assert(!contents.includes(blogToDelete.title))

    assert.strictEqual(blogsAfterDelete.length, helper.testBlogs.length - 1)
})

test('all fields of a blog can be edited', async () => {
    const blogsAtStart = await helper.blogsinDB()
    const blogToEdit = blogsAtStart[0]

    const newFields = {
        title: "Presidentin elämää 5",
        author: "Alex Stubbi",
        url: "http://www.alexstubbi.fi/inflensser/antreprenuuialmind",
        likes: 6224
    }

    await api
        .put(`/api/blogs/${blogToEdit.id}`)
        .send(newFields)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAfterEdit = await helper.blogsinDB()
    assert.strictEqual(blogsAfterEdit.length, helper.testBlogs.length)

    const contents = blogsAfterEdit.map(n => n.title)
    assert(contents.includes('Presidentin elämää 5'))
})

after(async () => {
    await mongoose.connection.close()
})