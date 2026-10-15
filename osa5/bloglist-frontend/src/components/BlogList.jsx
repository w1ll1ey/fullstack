import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({
    blogs,
    handleLike,
    handleRemoval,
    user
}) => {

    return (
        <div>
            <h2>Blogs</h2>
            <ul>
                {blogs.map(blog => (
                    <li key={blog.id}>
                        <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default BlogList