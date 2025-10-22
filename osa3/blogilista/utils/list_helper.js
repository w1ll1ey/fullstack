const lodash = require('lodash')

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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const appearences = lodash.countBy(blogs, 'author')

    topAuthor = lodash.maxBy(Object.keys(appearences), author => appearences[author])

    return {
        author: topAuthor,
        blogs: appearences[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const group = lodash.groupBy(blogs, 'author')

    const likes = lodash.mapValues(group, author => lodash.sumBy(author, 'likes'))

    const mostLiked = lodash.maxBy(Object.keys(likes), author => likes[author])

    return {
        author: mostLiked,
        likes: likes[mostLiked]
    }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }