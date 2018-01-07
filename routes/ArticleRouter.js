const router = require('express').Router()

const { addArticles, getArticles } = require('../controllers/ArticleController')

router.post('/new', addArticles)
router.get('/', getArticles)

module.exports = router