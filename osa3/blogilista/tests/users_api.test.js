const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with a unique username', async () => {
        const usersAtStart = await helper.usersinDB()

        const newUser = {
            username: 'astubbi',
            name: 'Alex Stubb',
            password: 'triathlon'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfterAdding = await helper.usersinDB()
        assert.strictEqual(usersAfterAdding.length, usersAtStart.length + 1)

        const usernames = usersAfterAdding.map(n => n.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username or password is not valid', async () => {
        const usersAtStart = await helper.usersinDB()

        const newUser1 = {
            username: '',
            name: 'user1',
            password: 'password1'
            }

        const newUser2 = {
            username: 'user2',
            name: 'user2',
            password: ''
        }

        const newUser3 = {
            username: 'ab',
            name: 'user3',
            password: 'password3'
        }

        const newUser4 = {
            username: 'user4',
            name: 'user4',
            password: 'pw'
        }

        const result1 = await api
            .post('/api/users')
            .send(newUser1)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const result2 = await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const result3 = await api
            .post('/api/users')
            .send(newUser3)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const result4 = await api
            .post('/api/users')
            .send(newUser4)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAfterAdding = await helper.usersinDB()
        assert(result1.body.error.includes('username and password required'))
        assert(result2.body.error.includes('username and password required'))
        assert(result3.body.error.includes('username must be at least 3 characters'))
        assert(result4.body.error.includes('password must be at least 3 characters'))
        
        assert.strictEqual(usersAtStart.length, usersAfterAdding.length)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersinDB()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'censored'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfterAdding = await helper.usersinDB()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAfterAdding.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})