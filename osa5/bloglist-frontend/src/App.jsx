import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateForm from './components/Create'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)
  const createFormRef = useRef()

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification('Wrong username or password')
      setError(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)

    window.localStorage.removeItem('loggedBlogappUser')
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

  blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={notification} error={error} />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>

      <Notification message={notification} error={error} />

      <div>
        <p>{user.name} logged in</p>

        <form onSubmit={handleLogout}>
          <button type="submit">logout</button>
        </form>
      </div>

      <Togglable buttonLabel="create new blog" ref={createFormRef}>
        <CreateForm
          blogService={blogService}
          blogs={blogs}
          setBlogs={setBlogs}
          setNotification={setNotification}
          setError={setError}
          createFormRef={createFormRef}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          name={user.name}
          handleLike={handleLike}
          handleRemoval={handleRemoval}
        />
      )}
    </div>
  )
}

export default App