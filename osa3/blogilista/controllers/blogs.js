const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  if (!body.author || !body.url) {
    response.status(400).end()
  }

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(blog.id)
  }

  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = body.title
  blog.author = body.author
  blog.url = body.url
  blog.likes = body.likes

  updatedBlog = await blog.save()
  return response.json(updatedBlog)
})

module.exports = blogRouter