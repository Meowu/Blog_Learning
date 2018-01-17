
const router = require('express').Router()

const { addCategory, getCategories, getCategoryArticles, handleOneCategory } = require('../controllers/CategoryControll')

router.post('/new', addCategory)
router.get('/', getCategories)
router.all('/:id', handleOneCategory)
router.get('/:id/articles', getCategoryArticles)

module.exports = router