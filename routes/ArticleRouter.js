const router = require('express').Router()

const { addArticles, getArticles, selectArticle, likeArticles } = require('../controllers/ArticleController')

router.post('/new', addArticles)
router.get('/', getArticles)
router.put('/:id/like', likeArticles)
router.all('/:id', selectArticle)

module.exports = router