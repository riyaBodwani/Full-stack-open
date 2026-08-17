const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  const blogCounts = {}

  blogs.forEach(blog => {
    blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
  })

  let topAuthor = null
  let highestCount = 0

  for (const author in blogCounts) {
    if (blogCounts[author] > highestCount) {
      highestCount = blogCounts[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    blogs: highestCount
  }
}

const mostLikes = (blogs) => {
  const authorLikes = {}

  blogs.forEach(blog => {
    authorLikes[blog.author] =
      (authorLikes[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let highestLikes = 0

  for (const author in authorLikes) {
    if (authorLikes[author] > highestLikes) {
      highestLikes = authorLikes[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: highestLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}