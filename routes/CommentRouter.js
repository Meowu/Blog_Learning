const router = require('express').Router()
const { auth } = require('../controllers/Auth')

const { addComments, findComments, upComments, findOneComment } = require('../controllers/CommentController')

// 前台新增评论或者点赞评论
router.post('/:id', addComments)
router.put('/:id', upComments)

// 后台获取评论、删除评论
router.get('/cms/all', auth, findComments)
router.all('/cms/:id', auth, findOneComment)

module.exports = router