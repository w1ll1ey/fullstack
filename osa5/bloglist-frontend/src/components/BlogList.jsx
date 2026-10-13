import Blog from './Blog'

const BlogList = ({
    blogs,
    handleLike,
    handleRemoval,
    user
}) => {

    return (
        <div>
            <h2>Blogs</h2>
            {blogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    name={user ? user.name : null}
                    handleLike={handleLike}
                    handleRemoval={handleRemoval}
                />
            )}
        </div>
    )
}

export default BlogList