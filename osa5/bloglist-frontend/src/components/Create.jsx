import { useState } from 'react'

const CreateForm = ({
    blogService,
    blogs,
    setBlogs,
    setNotification,
    setError,
    createFormRef
}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const newBlog = await blogService.create({ title, author, url })
            createFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(newBlog))
            setTitle('')
            setAuthor('')
            setUrl('')
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

    return (
        <div>
            <h2>Create new</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        title
                        <input
                            type="text"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        author
                        <input
                            type="text"
                            value={author}
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        url
                    </label>
                    <input
                        type="text"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default CreateForm