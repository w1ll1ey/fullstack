import { useState } from 'react'

const Blog = ({
  blog,
  name,
  blogService,
  setBlogs,
  blogs,
  setNotification,
  setError
}) => {
  const [extendedId, setExtendedId] = useState(null)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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

  const infoForm = () => {
    return (
      <div>
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={() => (handleLike(blog))}>like</button>
        <br />
        {blog.user.name}
        <br />
        {blog.user.name === name && (
          <button onClick={() => (handleRemoval(blog))}>remove</button>
        )}
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setExtendedId(prev => prev === blog.id ? null : blog.id)}>
        {extendedId === blog.id ? "hide" : "view"}
      </button>
      {extendedId && infoForm()}
    </div>
  )
}

export default Blog