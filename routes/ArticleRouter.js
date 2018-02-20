const router = require('express').Router()

const { addArticles, getArticles, selectArticle, likeArticles, getOneArticle, postComments, getArchives } = require('../controllers/ArticleController')
// cms
router.post('/new', addArticles)
router.get('/', getArticles)
router.all('/cms/:id', selectArticle)

// front
router.get('/archives', getArchives)
router.put('/:id', likeArticles)
router.get('/:id', getOneArticle)
router.post('/:id/comments', postComments)
module.exports = router