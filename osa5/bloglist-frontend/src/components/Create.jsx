const CreateForm = ({
    handleSubmit,
    title,
    author,
    url,
    setTitle,
    setAuthor,
    setUrl
}) => {

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