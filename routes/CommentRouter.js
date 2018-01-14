const router = require('express').Router()

const { addComments, findComments } = require('../controllers/CommentController')

router.post('/new', addComments)
router.all('/:articleId', findComments)

module.exports = router