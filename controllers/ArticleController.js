const Article = require('../models/Article')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
// const hljs = require('highlight.js')
const marked = require('marked')

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

exports.getArticles = (req, res, next) => {
  let {page, page_size, tag, category, rendermd} = req.query
  page = Number(page) || 1
  page_size = Number(page_size) || 10
  const projection = !!rendermd
    ? '-html_string'
    : '-markdown'
  if (tag) {
    tag = escape(trim(tag))
    // 这种 $in 的用法表示查找条件为：文章的 tags 数组中包含至少一个 tag 所在数组中的字段，这种方法便于通过多个 tag 来筛选。当然直接
    // {tags: tag} 也可以查找到的。
    Article.find({
      tags: {
        $in: [tag]
      }
    }, projection, {
      skip: (page - 1) * page_size,
        limit: page_size
      })
      .populate('category', '_id name')
      .populate('tags', '_id name')
      .exec(function (err, result) {
        if (err) 
          return return3(res)
        return0(result, res)
      })
  } else if (category) {
    category = escape(trim(category))

    // populate 的第二个参数是 [select]<Object, String>
    Article.find({
      category: category
    }, projection, {
      skip: (page - 1) * page_size,
        limit: page_size
      })
      .populate('category', '_id name')
      .populate('tags', '_id name')
      .exec(function (err, result) {
        if (err) 
          return return3(res)
        return0(result, res)
      })
  } else { // The second params is projection object.
    Article.find({}, projection, {
      skip: (page - 1) * page_size,
        limit: page_size
      })
      .populate('category', '_id name')
      .populate('tags', '_id name')
      .exec(function (err, result) {
        if (err) 
          return return3(res) // 查找文章的时候获取其标签和分类。
        res
          .status(200)
          .json({code: 0, msg: '查找成功', data: result})
      })
  }
}

exports.addArticles = (req, res, next) => {
  console.log(req.body);
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
  summary = typeof summary === 'string' ? escape(trim(summary)) : ''
  cover = typeof cover === 'string' ? escape(trim(cover)) : ''
  category && (category = escape(trim(category)))
  markdown = trim(markdown)
  tags = typeof tags === 'string'
    ? tags.split(',')
    : []
  if (!title) {
    return1('标题不能为空', res)
  } else if (!path) {
    return1('path 不能为空', res)
  } else if (!markdown) {
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
  marked(markdown, (err, content) => {
    if (err) {
      return3(res)
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
        return3(res)
      }
      return0({}, res)
    })
  })
}

exports.selectArticle = (req, res, next) => {
  const method = req.method
  const id = req.params.id
  if (!id) {
    return1('id不合法', res)
  }
  if (method === 'GET') {
    // get 请求时，判断是读取文章 html 还是获取 markdown 来编辑
    const render = req.query.rendermd
      ? true
      : false
    Article
      .findById(escape(id), render ? '-html_string' : '-markdown').populate('tags', '_id name')
      .populate('category', '_id name').exec(function (err, result) {
        if (err) {
          return3(res)
        } else if (!result) {
          return2('id不存在', res)
        } else {
            return0(result, res)
          }
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
      summary = typeof summary === 'string' ? escape(trim(summary)) : ''
      cover = typeof cover === 'string' ? escape(trim(cover)) : ''
      category && (category = escape(trim(category)))
      markdown = trim(markdown)
      tags = typeof tags === 'string'
        ? tags.split(',')
        : []
      if (!title) {
        return1('标题不能为空', res)
      } else if (!path) {
        return1('path 不能为空', res)
      } else if (!markdown) {
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
      marked(markdown, (err, content) => {
        if (err) {
          return3(res)
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
        Article.findByIdAndUpdate(id, newArticle, function(err, result) {
          err && return3(res)
          return0({}, res)
        })
    })
  } else if (method === 'DELETE') {
    Article.findByIdAndRemove(id, function(err, result) {
      err && return3(res) // 返回 result 是找到的文档
      !result && return1('id 不存在', res)
      return0({}, res)
    })
  } else {
    res.status(405).json({
      code: 1,
      msg: 'Method rejected.'
    })
  }
}