import { useState } from 'react'

const Blog = ({
  blog,
  name,
  blogService,
  setBlogs,
  blogs
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
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
  }

  const infoForm = () => {
    return (
      <div>
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={() => (handleLike(blog))}>like</button>
        <br />
        {name}
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