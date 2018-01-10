const router = require('express').Router()

const { addArticles, getArticles, selectArticle } = require('../controllers/ArticleController')

router.post('/new', addArticles)
router.get('/', getArticles)
router.all('/:id', selectArticle)

module.exports = router