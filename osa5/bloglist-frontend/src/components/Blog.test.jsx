import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import Create from './Create'

const blog = {
    id: '123',
    title: 'Blog about something',
    url: 'www.something.com',
    likes: 67,
    user: {
        name: 'Someone'
    }
}

test('renders content', () => {
    render(<Blog blog={blog} />)

    const title = screen.getByText('Blog about something')
    const url = screen.queryByText('www.something.com')
    const likes = screen.queryByText("67")
    expect(url).toBeNull()
    expect(likes).toBeNull()
})

test('renders rest of the content when pressing view', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText(
        'www.something.com', { exact: false }
    )
    const likes = screen.getByText(
        '67', { exact: false }
    )
    const username = screen.getByText(
        'Someone', { exact: false }
    )
})

test('clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()

    render(
        <Blog blog={blog} handleLike={mockHandler} />
    )

    const user = userEvent.setup()
    const button1 = screen.getByText('view')
    await user.click(button1)
    const button2 = screen.getByText('like')
    await user.click(button2)
    await user.click(button2)

    expect(mockHandler.mock.calls).toHaveLength(2)

})

test('create form calls the callback function with the correct inputs', async () => {
    const createBlog = vi.fn()

    render(<Create createBlog={createBlog} />)

    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Test')
    await user.type(authorInput, 'Anonymous')
    await user.type(urlInput, 'www.something.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test')
    expect(createBlog.mock.calls[0][0].author).toBe('Anonymous')
    expect(createBlog.mock.calls[0][0].url).toBe('www.something.com')
})