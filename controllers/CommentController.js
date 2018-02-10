const {equals, isEmpty, trim, escape} = require('validator')
const Comment = require('../models/Comment')
const Article = require('../models/Article')
const async = require('async')
const marked = require('marked')
const {return0, return1, return2, return3} = require('./_response')

// 前端 api 

// 用户点赞评论
exports.upComments = (req, res, next) => {
  const id = req.params.id
  if (!trim(id)) {
    return return1('id 不能为空。', res)
  }
  Comment
    .findByIdAndUpdate(id, {
      $inc: {
        ups: 1
      }
    }, function (err, result) {
      if (err) {
        return return3(res)
      } else if (!result) {
        return return1('id 不存在', res)
      }
      return return0({}, res)
    })
}

// 给文章增加评论或者回复评论
exports.addComments = (req, res, next) => {
  const body = req.body
  let {
    name,
    email,
    site,
    content,
    avatar,
    articleId,
    commentId
  } = body
  if (!articleId && !commentId) {
    return return1('id 不能为空！', res)
  }
  name = escape(trim(name))
  email = escape(trim(email))
  avatar = trim(avatar) || ''
  site = escape(trim(site)) || ''
  commentId && (commentId = escape(trim(commentId)) || '')
  articleId && (articleId = escape(trim(articleId)) || '')
  content = trim(content)
  if (!name) {
    return return1('姓名不能为空', res)
  } else if (!email) {
    return return1('email 不能为空', res)
  } else if (!content) {
    return return1('内容不能为空', res)
  }
  // const
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js')
        .highlightAuto(code)
        .value;
    },
    gfm: true
  });
  marked(content, (err, contents) => {
    if (err) return return3(res)
    const newComment = new Comment({
      name: name,
      email: email,
      avatar: avatar,
      site: site,
      // article: articleId,
      content: contents,
    })
    if (commentId) {
      newComment.set('reply_to', commentId)
    } else {
      newComment.set('article', articleId)
    }
    newComment.save(function (err, result) {
      if (err) return return3(res)
      // 如果提交了评论 id 则是对某条评论的回复，否则是对文章的评论
      if (commentId) {
        // { $push: { <filed1>: <value1>, ...}} 如果 field1 不存在将会创建一个 field1 字段，其值是包含 value1 的数组。
        Comment
          .findByIdAndUpdate(commentId, {
            $push: {
              replies: result._id
            }
          }, function (err, result) { // 必须指定 options: { new: true } result才会返回更新后的文档。
            if (err) {
              return return3(res)
            } else if (!result) {
              return return1('id 不存在', res)
            }
            return return0({}, res)
          })
      } else {
        Article.findByIdAndUpdate(articleId, {
          $push: {
            comments: result._id
          }
        }, function(err, result) {
          if (err) { 
            return return3(res)
          } else if (!result) {
            return return1('文章不存在', res)
          }
          return return0({}, res)
        }) 
      }
    })
  })
}

// 后台获取筛选评论列表
exports.findComments = (req, res, next) => {
  let conditions
  let { start_date, end_date, query, keyword, page, page_size } = req.query
  page = Number(page) || 1
  page_size = Number(page_size) || 10
  options = {
    skip: (page - 1) * page_size,
    limit: page_size
  }
  start_date && (start_date = new Date(Number(start_date))) // 查找参数是字符串，务必记得转化为数字再构建日期。
  end_date && (end_date = new Date(Number(end_date)))
  if (Object.is(Number(query), 1)) {
    if (start_date) {
      conditions = {name: { $regex: keyword, $options: 'is' }, createdAt: {$gte: start_date, $lte: end_date}}
    } else {
      conditions = { name: { $regex: keyword, $options: 'is' } }
    }
  } else if (Object.is(Number(query), 2)) {
    // $regex Provides regular expression capabilities for pattern matching strings in queries. 模糊查找，类似 sql 中的 like 。
    if (start_date) {
      conditions = {content: { $regex: keyword, $options: 'i' }, createdAt: {$gte: start_date, $lte: end_date}}
    } else {
      conditions = { content: { $regex: keyword, $options: 'i'} }
    }
  } else if (start_date && end_date) {
    conditions = { createdAt: {$gte:start_date, $lte: end_date}}
  }
  Comment.find(conditions, null, options).populate('article', '_id title').populate('reply_to', '_id name').exec(function (err, result) {
    if (err) {
      return return3(res)
    }
    const data = result.map(rs => {
      let reply_to
      if (rs.article) {
        reply_to = { id: rs.article._id, name: rs.article.title }
      } else {
        // reply_to = { id: rs.reply_to._id, name: rs.reply_to.name}
        reply_to = { id: null, name: '匿名' }
      }
      const meta = rs.meta
      meta.reply_to = reply_to
      return meta
    })
    return return0(data, res)
    // return return0(result, res)
  })
  // const 
}

// 后台删除评论、获取评论列表
exports.findOneComment = (req, res, next) => {
  const id = req.params.id
  if (!id) {
    return return1('id 不能为空', res)
  }
  // 获取评论及其回复
  if (req.method === 'GET') {
    // console.log(id);
    Comment
      .findById(id, '_id name site avatar content ups replies')
      .populate('replies', '_id name site avatar content ups replies')
      .exec(function (err, result) {
        // console.log(result);
        if (err) {
          return return3(res)
        } else if (!result) {
          return return1('id 不存在', res)
        }
        // console.log(result.replies[0].info)
        // console.log(result.replies.map(reply => reply.info));
        // console.log(result.info.replies);
        const data = result.info
        data.replies = result.replies.map(reply => reply.info)
        // result.info.replies = result.replies.map(reply => reply.info) // populate 是获取不到 virtuals 的？
        return return0(data, res)
      })
  } else if (req.method === 'DELETE') {
    // 评论及其回复。
    Comment
      .findByIdAndRemove(trim(id), function (err, result) {
        if (err) return return3(res)
        if (!result) {
          return return1('id 不存在', res)
        } else {
          const {replies} = result
          if (replies.length) {
            // didnot remove _id from those comments referencing this comment yet.
            // Comment.deleteMany({_id: {$in: replies}}, function(err) {   err &&
            // return1('评论删除成功，子评论删除失败。', res)   // return0({}, res) })
            Comment
              .deleteMany({
              _id: {
                $in: replies
              }
            })
              .exec()
          }
          return return0({}, res)
        }
      })
  }
}
