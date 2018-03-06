const router = require('express').Router()

const { changeTag, getTags, addTag } = require('../controllers/TagControllers')
const { auth } = require('../controllers/Auth')

router.get('/', getTags)
router.post('/new', auth, addTag)
router.all('/:id', changeTag)

module.exports = router