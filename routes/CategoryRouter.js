
const router = require('express').Router()
const { auth } = require('../controllers/Auth')

const { addCategory, getCategories, getCategoryArticles, handleOneCategory, getFrontCategories } = require('../controllers/CategoryControll')

router.post('/new', auth, addCategory)
router.all('/:id', auth, handleOneCategory)
router.get('/:id/articles', auth, getCategoryArticles)
// router.get('/')

router.get('/', getFrontCategories)
module.exports = router