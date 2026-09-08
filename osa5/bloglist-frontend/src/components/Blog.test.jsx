import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
    const blog = {
        title: 'Blog about something',
        url: 'www.something.com',
        likes: 67
    }

    render(<Blog blog={blog} />)

    const title = screen.getByText('Blog about something')
    const url = screen.queryByText('www.something.com')
    const likes = screen.queryByText("67")
    expect(url).toBeNull()
    expect(likes).toBeNull()
})

test('renders rest of the content when pressing view', async () => {
    const blog = {
        id: '123',
        title: 'Blog about something',
        url: 'www.something.com',
        likes: 67,
        user: {
            name: 'Someone'
        }
    }

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