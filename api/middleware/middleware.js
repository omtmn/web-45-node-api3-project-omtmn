const User = require('../users/users-model')

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString()
  const method = req.method
  const url = req.originalUrl
  console.log(`[${timestamp}, ${method}, ${url}]`)
  next()
}

async function validateUserId(req, res, next) {
  try {
    const user = await User.getById(req.params.id)
    if(!user){
      res.status(400).json({
        message: "*Gasp* User Not Found!"
      })
    } else {
      req.user = user
      next()
    }
  } catch (err) {
    res.status(500).json({
      message: "Could not find user"
    })
  }
}

function validateUser(req, res, next) {
  const { name } = req.body
  if(!name) {
    res.status(400).json({
      message: "missing required name field"
    })
  } else {
    req.name = name.trim()
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
}

// do not forget to expose these functions to other modules

module.exports = {
  logger, 
  validateUserId, 
  validateUser, 
  validatePost
}
