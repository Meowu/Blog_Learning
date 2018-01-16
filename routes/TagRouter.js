const router = require('express').Router()

const { changeTag, getTags, addTag } = require('../controllers/TagControllers')

router.get('/', getTags)
router.post('/new', addTag)
router.all('/:id', changeTag)

module.exports = router