const router = require('express').Router()

const { addComments, findComments, upComments, findOneComment } = require('../controllers/CommentController')

router.post('/new', addComments)
router.put('/:id', upComments)
router.get('/cms/all', findComments)
router.all('/cms/:id', findOneComment)

module.exports = router