const router = require('express').Router()

const { changeTag, getTagsCount, addTag } = require('../controllers/TagControllers')

router.get('/counts', getTagsCount)
router.post('/new', addTag)
router.all('/:id', changeTag)

module.exports = router