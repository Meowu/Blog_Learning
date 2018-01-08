
const router = require('express').Router()

const { addCategory, getCategories, deleteCategory, getCategoryArticles } = require('../controllers/CategoryControll')

router.post('/new', addCategory)
router.get('/', getCategories)
router.delete('/:id', deleteCategory)
router.get('/:id/articles', getCategoryArticles)

module.exports = router