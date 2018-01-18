const router = require('express').Router()

const { addComments, findComments, upComments } = require('../controllers/CommentController')

router.post('/new', addComments)
router.put('/:id', upComments)
router.all('/cms/:id', findOneComments)

module.exports = router