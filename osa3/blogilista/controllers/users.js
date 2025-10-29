const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    if (!username || !password) {
        response.status(400).json({ error: 'username and password required' })
    }

    if (username.length < 3) {
        response.status(400).json({ error: 'username must be at least 3 characters'})
    }

    if (password.length < 3) {
        response.status(400).json({ error: 'password must be at least 3 characters'})
    }

    const existingUsers = await User.find({})
    const existingUsernames = existingUsers.map(n => n.username)

    if (existingUsernames.includes(username)) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { user: 0 })

    response.json(users)
})

module.exports = userRouter