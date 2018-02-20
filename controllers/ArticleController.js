const Article = require('../models/Article')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const Comment = require('../models/Comment')
// const hljs = require('highlight.js')
const marked = require('marked')
const async = require('async')
const {return0, return1, return2, return3} = require('./_response')

const {
  isEmpty,
  trim,
  escape,
  equals,
  isAlphanumeric,
  isEmail,
  normalizeEmail
} = require('validator')


exports.getArchives = (req, res, next) => {
  let {page, page_size} = req.query
  page = Number(page) || 1
  page_size = Number(page_size) || 10
  const projection = '-markdown -html_string'
  console.log('aggregate...')
  Article.aggregate([{$group: {_id: {year: {$year: '$createdAt'}}, articles: {$push: {id: '$_id', title: '$title', created_at: '$createdAt'}}}}]).sort('-created_at').exec(function (err, result) {
    if (err) return return3(res)
    console.log(result);
    return return0(result, res)
  })
}

exports.getArticles = (req, res, next) => {
  let {page, page_size, tag, category, rendermd} = req.query
  page = Number(page) || 1
  page_size = Number(page_size) || 10
  // const projection = !!rendermd
  //   ? '-html_string'
  //   : '-markdown'
  const projection = '-markdown -html_string'
  if (tag) {
    tag = escape(trim(tag))
    // 这种 $in 的用法表示查找条件为：文章的 tags 数组中包含至少一个 tag 所在数组中的字段，这种方法便于通过多个 tag 来筛选。当然直接
    // {tags: tag} 也可以查找到的。
    Article.find({
      tags: {
        $in: [tag]
      }
    }, projection, {  // options
      skip: (page - 1) * page_size,
      limit: page_size,
      sort: {createdAt: 'desc'},
    })
    // .populate('category', '_id name')
    // .populate('tags', '_id name')
    .exec(function (err, result) {
      if (err)
      return return3(res)
      const data = result.map(article => article.info)
      return return0(data, res)
    })
  } else if (category) {
    category = escape(trim(category))

    // populate 的第二个参数是 [select]<Object, String>
    Article.find({
      category: category
    }, projection, {
      skip: (page - 1) * page_size,
      limit: page_size,
      sort: {createdAt: 'desc'},
    })
    .populate('category', '_id name')
    .populate('tags', '_id name')
    .exec(function (err, result) {
      if (err)
      return return3(res)
      const data = result.map(article => article.info)
      return return0(data, res)
    })
  } else { // The second params is projection object.
    Article.find({}, projection, {
      skip: (page - 1) * page_size,
      limit: page_size,
      sort: {createdAt: 'desc'},
      })
      .populate('category', '_id name')
      .populate('tags', '_id name')
      .exec(function (err, result) {
        if (err)
          return return3(res) // 查找文章的时候获取其标签和分类。
        const data = result.map(article => article.info)
        return return0(data, res)
      })
  }
}

exports.addArticles = (req, res, next) => {
  const body = req.body
  let {
    title,
    path,
    summary,
    cover,
    markdown,
    category,
    tags
  } = body
  title = escape(trim(title))
  path = escape(trim(path))
  summary = typeof summary === 'string'
    ? escape(trim(summary))
    : ''
  cover = typeof cover === 'string'
    ? escape(trim(cover))
    : ''
  category && (category = escape(trim(category)))
  markdown = trim(markdown)
  tags = typeof tags === 'string'
    ? tags.split(',')
    : []
  if (!title) {
    return return1('标题不能为空', res)
  } else if (!path) {
    return return1('path 不能为空', res)
  } else if (!markdown) {
    return return1('内容不能为空', res)
  }
  // const
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js')
        .highlightAuto(code)
        .value;
    }
  });
  marked(markdown, (err, content) => {
    if (err) {
      return return3(res)
    }
    const newArticle = new Article({
      title: title,
      path: path,
      category: category,
      markdown: markdown,
      html_string: content,
      tags: tags
    })
    summary && (newArticle.summary = summary)
    cover && (newArticle.cover = cover)
    newArticle.save(function (err) {
      if (err) {
        return return3(res)
      }
      return return0({}, res)
    })
  })
}

// 后台操作文章
exports.selectArticle = (req, res, next) => {
  const method = req.method
  const id = req.params.id
  if (!id) {
    return return1('id不合法', res)
  }
  if (method === 'GET') {
    // get 请求时，判断是读取文章 html 还是获取 markdown 来编辑 const render = req.query.rendermd   ?
    // true   : false
    Article.findById(escape(id), '-html_string')
            .populate('tags', '_id name')
            .populate('category', '_id name')
            .exec(function(err, result) {
              if (err) {
                return return3(res)
              } else if (!result) {
                return return1('id 不存在', res)
              }
              return return0(result, res)
            })
  } else if (method === 'PUT') {
    const body = req.body
    let {
      title,
      path,
      summary,
      cover,
      markdown,
      category,
      tags
    } = body
    title = escape(trim(title))
    path = escape(trim(path))
    summary = typeof summary === 'string'
      ? escape(trim(summary))
      : ''
    cover = typeof cover === 'string'
      ? escape(trim(cover))
      : ''
    category && (category = escape(trim(category)))
    markdown = trim(markdown)
    tags = typeof tags === 'string'
      ? tags.split(',')
      : []
    if (!title) {
      return return1('标题不能为空', res)
    } else if (!path) {
      return return1('path 不能为空', res)
    } else if (!markdown) {
      return return1('内容不能为空', res)
    }
    // const
    marked.setOptions({
      highlight: function (code) {
        return require('highlight.js')
          .highlightAuto(code)
          .value;
      }
    });
    marked(markdown, (err, content) => {
      if (err) {
        return return3(res)
      }
      const newArticle = new Article({
        title: title,
        path: path,
        category: category,
        markdown: markdown,
        html_string: content,
        tags: tags,
        summary: summary,
        cover: cover,
        _id: id
      })
      Article.findByIdAndUpdate(id, newArticle, function (err, result) {
        if (err) return return3(res)
        return return0({}, res)
      })
    })
  } else if (method === 'DELETE') {
    Article
      .findByIdAndRemove(id, function (err, result) {
        if (err) return return3(res) // 返回 result 是找到的文档
        if (!result) return return1('id 不存在', res)
        Comment.deleteMany({ article: id}).exec()
        return return0({}, res)
      })
  } else {
    res
      .status(405)
      .json({code: 1, msg: 'Method rejected.'})
  }
}

// 前端 api 用户点赞文章
exports.likeArticles = (req, res, next) => {
  const id = req.params.id
  console.log(id);
  if (!trim(id)) {
    return return1('id 不能为空', res)
  } else {
    Article
      .findByIdAndUpdate(escape(id), {
        $inc: {
          likes: 1
        }
      }, function (err, result) {
        if (err) return return3(res)
        return return0({}, res)
      })
  }
}

// 评论文章
exports.postComments = (req, res, next) => {
  const id = req.params.id
  if (!id) {
    return return1('id 不能为空', res)
  }
  const body = req.body
  let {
    name,
    email,
    site,
    content,
    avatar,
  } = body

  if (!name.trim()) {
    return return1('姓名不能为空', res)
  } else if (!email.trim()) {
    return return1('email 不能为空', res)
  } else if (!content.trim()) {
    return return1('内容不能为空', res)
  }
  name = escape(trim(name))
  email = escape(trim(email))
  avatar = avatar || ''
  site = escape(trim(site)) || ''
  content = trim(content)
  // const
  marked.setOptions({
    highlight: function (code) {
      return require('highlight.js')
        .highlightAuto(code)
        .value;
    },
    gfm: true
  });
  console.log('set...')
  marked(content, (err, contents) => {
    console.log('marked.')
    if (err) return return3(res)
    const newComment = new Comment({
      name: name,
      email: email,
      avatar: avatar,
      site: site,
      article: id,
      content: contents,
    })
    newComment.save(function (err, result) {
      if (err) return return3(res)
        // { $push: { <filed1>: <value1>, ...}} 如果 field1 不存在将会创建一个 field1 字段，其值是包含 value1 的数组。
        Article.findByIdAndUpdate(id, {
          $push: {
            comments: result._id
          }
        }, function(err, result) {
          if (err) {
            return return3(res)
          } else if (!result) {
            return return1('文章 id 不存在', res)
          }
          return return0({}, res)
        })
    })
  })
}

// 获取某篇文章详情
exports.getOneArticle = (req, res, next) => {
  // const method = req.method
  const id = req.params.id
  console.log(id);
  if (!id) {
    return return1('请输入 id', res)
  }
  async
    .parallel({
      article: function (cb) {
        Article.findById(escape(trim(id)), '-markdown')
          .populate('tags', '_id name')
          .populate('category', '_id name')
          .exec(cb)
      },
      comments: function (cb) {
        Comment
          .find({article: id})
          .populate('replies')
          .exec(cb)
      }
    }, function (err, result) {
      if (err) {
        return return3(res)
      }
      if (!result.article) {
        return return1('id 不存在', res)
      }
      console.log(result);
      const articleContent = result.article
      articleContent.page_views++;

      Article.findByIdAndUpdate(id, {
        $inc: {
          page_views: 1
        }
      })
        .then(() => {})
        .catch(e => {
          throw Error(e)
        })
      articleContent.comments = result.comments
      console.log(articleContent);
      return return0(articleContent, res)
    })
}