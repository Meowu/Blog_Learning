const {equals, isEmpty, trim, escape} = require('validator')
const Comment = require('../models/Comment')
const Article = require('../models/Article')
const async = require('async')
const marked = require('marked')
const {return0, return1, return2, return3} = require('./_response')

exports.addComments = (req, res, next) => {
  const body = req.body
  let {
    name,
    email,
    site,
    article,
    content,
    articleId,
    commentId
  } = body
  if (!articleId && !commentId) {
    return1('文章或者评论id不能为空！')
  }
  name = escape(trim(name))
  email = escape(trim(email))
  avatar = typeof avatar === 'string' ? escape(trim(avatar)) : ''
  site = typeof site === 'string' ? escape(trim(site)) : ''
  articleId && (articleId = escape(trim(articleId)) || '')
  commentId && (commentId = escape(trim(commentId)) || '')
  content = trim(content)
  if (!name) {
    return1('姓名不能为空', res)
  } else if (!email) {
    return1('email 不能为空', res)
  } else if (!content) {
    return1('内容不能为空', res)
  }
  // const
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js')
        .highlightAuto(code)
        .value;
    }
  });
  marked(content, (err, contents) => {
    err && return3(res)
    const newComment = new Comment({
      name: name,
      email: email,
      avatar: avatar,
      site: site,
      article: articleId,
      content: content,
      html_string: contents,
    })
    newComment.save(function (err, result) {
      err && return3(res)
      if (commentId) { // { $push: { <filed1>: <value1>, ...}} 如果 field1 不存在将会创建一个 field1 字段，其值是包含 value1 的数组。
        Comment.findByIdAndUpdate(commentId, {$push: {replies: result._id}},  function(err, result) { // 必须指定 options: { new: true } result才会返回更新后的文档。
          err && return3(res)
          console.log(result);
          return0({}, res)
        })
      } else {
        return0({}, res)
      }
    })
  })
}

exports.findComments = (req, res, next) => {
  const id = req.params.articleId
  if (!id) {
    return1('id 不能为空', res)
  }
  if (req.method === 'GET') {
    Comment.find({article: id}, '_id name site avatar html_string ups replies').populate('replies', '_id name site avatar html_string ups replies').exec(function(err, result) {
      err && return3(res)
      return0(result, res)
    })
  } else if (req.method === 'DELETE') {
    Comment.findByIdAndRemove(id, function(err, result) {
      err && return3(res)
      if (!result) {
        return1('id 不存在', res)
      } else {
        const { replies } = result
        console.log(replies);
        if (replies.length) {
          // didnot remove _id from those comments referencing this comment yet.
          Comment.deleteMany({_id: {$in: replies}}, function(err) {
            err && return1('评论删除成功，子评论删除失败。', res)
            // return0({}, res)
          })
        }
        return0({}, res)
      }
    })
  }
}

// exports.removeComments = (req, res, next) => {
//   const id = req.params = 
// }