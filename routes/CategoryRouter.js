
const router = require('express').Router()

const { addCategory, getCategories, getCategoryArticles, handleOneCategory, getFrontCategories } = require('../controllers/CategoryControll')

router.post('/new', addCategory)
router.all('/:id', handleOneCategory)
router.get('/:id/articles', getCategoryArticles)
// router.get('/')

router.get('/', getFrontCategories)
module.exports = router