import { useState } from 'react'

const Blog = ({ blog, name }) => {
  const [extendedId, setExtendedId] = useState(null)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const infoForm = () => {
    return (
      <div>
        {blog.url}
        <br />
        likes {blog.likes} <button>like</button>
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