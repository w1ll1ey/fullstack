import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/Login'
import Notification from './components/Notification'
import {
  Routes, Route, Link
} from 'react-router-dom'
import CreateForm from './components/Create'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)
  const createFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      navigate('/')
    } catch {
      setNotification('Wrong username or password')
      setError(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    setUser(null)

    window.localStorage.removeItem('loggedBlogappUser')
    navigate('/')
  }

  const handleLike = async (blog) => {
    const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1 })
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : { ...updatedBlog, user: blog.user }))
  }

  const handleRemoval = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        await blogService.remove(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotification(`${blog.title} removed.`)
        setError(false)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    } catch {
      setNotification('Could not remove the blog')
      setError(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const createBlog = async (newBlogObject) => {

    try {
      const newBlog = await blogService.create(newBlogObject)
      createFormRef.current.toggleVisibility()
      setBlogs(blogs.concat({ ...newBlog, user }))
      setNotification(`A new blog ${newBlog.title} by ${newBlog.author} added`)
      setError(false)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification('Could not add the blog')
      setError(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  blogs.sort((a, b) => b.likes - a.likes)

  const padding = {
    padding: 5
  }

  return (
    <>
      <div>
        <Link style={padding} to='/'>blogs</Link>
        {user ? (<button onClick={handleLogout}>logout</button>)
          : <Link style={padding} to='/login'>login</Link>}
      </div>

      <Routes>
        <Route path='/' element={
          <BlogList
            blogs={blogs}
            handleLike={handleLike}
            handleRemoval={handleRemoval}
            user={user}
          />
        } />
        <Route path='login' element={
          <LoginForm
            handleLogin={handleLogin}
            notification={notification}
            error={error}
          />
        } />
      </Routes>


      <Notification message={notification} error={error} />

      {user !== null && (
        <Togglable buttonLabel="create new blog" ref={createFormRef}>
          <CreateForm
            createBlog={createBlog}
          />
        </Togglable>
      )}
    </>
  )
}

export default App