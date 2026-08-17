const jwt = require('jsonwebtoken')
const User = require('./models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }

  next()
}

const userExtractor = async (request, response, next) => {
  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'token missing'
      })
    }

    const decodedToken = jwt.verify(
      request.token,
      process.env.SECRET
    )

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({
        error: 'user not found'
      })
    }

    request.user = user
    next()
  } catch (error) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor
}