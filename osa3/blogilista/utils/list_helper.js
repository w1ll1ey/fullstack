const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blogs) => {
        return sum + blogs.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const max = (max, blog) => {
        return blog.likes > max.likes ? blog : max
    }

    return blogs.reduce(max)
}

module.exports = { dummy, totalLikes, favoriteBlog }