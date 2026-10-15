import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const Blog = ({
  blog,
  name,
  handleLike,
  handleRemoval
}) => {
  const [extendedId, setExtendedId] = useState(null)
  const id = useParams().id

  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <a href={blog.url.startsWith('http') ? blog.url : 'https://' + blog.url} target=" blank" rel="noopener noreferrer">{blog.url}</a>
      <br />
      likes {blog.likes} {name && <button onClick={() => (handleLike(blog))}>like</button>}
      <br />
      Added by {blog.user.name}
      <br />
      {blog.user.name === name && (
        <button onClick={() => (handleRemoval(blog))}>remove</button>
      )}
    </div>
  )
}

export default Blog