const router = require('express').Router()

const { auth } = require('../controllers/Auth')
const { addArticles, getArticles, selectArticle, likeArticles, getOneArticle, postComments, getArchives } = require('../controllers/ArticleController')
// cms
router.post('/new', auth, addArticles)
router.get('/', getArticles)
router.all('/cms/:id', auth, selectArticle)

// front
router.get('/archives', getArchives)
router.put('/:id', likeArticles)
router.get('/:id', getOneArticle)
router.post('/:id/comments', postComments)
module.exports = router