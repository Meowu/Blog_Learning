const router = require('express').Router()

const { addArticles, getArticles, selectArticle, likeArticles, getOneArticle } = require('../controllers/ArticleController')
// cms
router.post('/new', addArticles)
router.get('/', getArticles)
router.all('/cms/:id', selectArticle)

// front 
router.put('/:id', likeArticles)
router.get('/:id', getOneArticle)

module.exports = router