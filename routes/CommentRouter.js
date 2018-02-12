const router = require('express').Router()

const { addComments, findComments, upComments, findOneComment } = require('../controllers/CommentController')

// 前台新增评论或者点赞评论
router.post('/new', addComments)
router.post('/new', addComments)
router.put('/:id', upComments)

// 后台获取评论、删除评论
router.get('/cms/all', findComments)
router.all('/cms/:id', findOneComment)

module.exports = router