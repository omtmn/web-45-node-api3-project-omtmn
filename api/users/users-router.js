const express = require('express');
const { 
  validateUserId, 
  validateUser,
  validatePost
} = require('../middleware/middleware')

const User = require('../users/users-model')
const Post = require('../posts/posts-model')

const router = express.Router();

router.get('/', (req, res, next) => {
    User.get()
    .then((users) => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({ name: req.name })
  .then((user) => {
    res.status(201).json(user)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
  .then((user) => {
    res.status(200).json(user)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
    User.remove(req.params.id)
    .then(res.json(req.user))
    .catch(next)
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  try {
    const result = await Post.insert({ user_id: req.params.id, text: req.text })
    res.status(201).json(result)
  } catch (error){
    next(error)
  }
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    customMessage: "not a good look! it failed!",
    error: error.message,
    stack: error.stack
  })
})

module.exports = router
