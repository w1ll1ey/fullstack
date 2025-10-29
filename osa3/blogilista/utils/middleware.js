const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    
    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        response.status(401).json({ error: 'token invalid' })
    }
    request.user = await User.findById(decodedToken.id)

    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    next(error)
}

module.exports = { tokenExtractor, userExtractor, errorHandler }