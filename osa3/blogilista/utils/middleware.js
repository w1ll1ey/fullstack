const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    
    next()
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    next(error)
}

module.exports = { tokenExtractor, errorHandler }