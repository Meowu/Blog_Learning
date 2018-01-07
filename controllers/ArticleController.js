const Article = require('../models/Article')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
// const hljs = require('highlight.js')
const marked = require('marked')

const { return0, return1, return2, return3 } = require('./_response')

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
  let { page, page_size, tag_name, category, rendermd } = req.query
  page = Number(page) || 1
  page_size = Number(page_size) || 10
  const projection = !!rendermd ? '-html_string' : '-markdown'
  console.log(projection);
  if (tag_name) {
    tag_name = escape(trim(tag_name))
    Tag.find({name: tag_name}).populate('Article',projection, {skip: (page - 1)*page_size, limit: page_size}).exec(function(err, result) {
      if (err) return return3(res)
      res.status(200).json({
        code: 0,
        msg: '查找成功',
        data: result
      })
    })
  } else if (category) {
    category = escape(trim(category))

    // populate 的第二个参数是 [select]<Object, String>
    Category.find({name: category}).populate('Article', projection, {skip: (page - 1) *page_size, limit: page_size}).exec(function(err, result) {
      if (err) return return3(res)
      res.status(200).json({
        code: 0,
        msg: '查找成功',
        data: result
      })
    })
  } else {  // The second params is projection object.
    Article.find({}, projection, {skip: (page - 1)*page_size, limit: page_size}, function(err, result) {
      if (err) return return3(res)
      res.status(200).json({
        code: 0,
        msg: '查找成功',
        data: result
      })
    })
  }
}

exports.addArticles = (req, res, next) => {
  console.log(req.body);
  const body = req.body
  let { title, path, summary, cover, markdown, category, tags } = body
  title = escape(trim(title))
  path = escape(trim(path))
  summary && (summary = escape(trim(summary)))
  cover && (cover = escape(trim(cover)))
  category && (category = escape(trim(category)))
  markdown = trim(markdown)
  tags = tags || []
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
      return require('highlight.js').highlightAuto(code).value;
    }
  });
  marked(markdown, (err, content) => {
    console.log(content);
    if (err) {
      console.log("render...");
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
    // tags.length && (newArticle.tags = tags)
    // summary && (newArticle.summary = summary)
    // cover && (newArticle.cover = summary)
    newArticle.save(function (err) {
      console.log("saving...");
      if (err) { 
        console.log(err);
        return3(res) 
      }
      return0({}, res)
    })
  })
}