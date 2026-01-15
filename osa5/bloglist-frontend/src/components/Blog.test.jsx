import { render, screen } from '@testing-library/react'
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