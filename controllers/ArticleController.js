const Article = require('../models/Article')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const hljs = require('highlight.js')
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
  let { page, page_number, tag_name, type, category } = req.body
  page = Number(page) || 1
  page_number = Number(page_number) || 10
  if (tag_name) {
    tag_name = escape(trim(tag_name))
    Tag.find({name: tag_name}).populate('Article',{skip: (page - 1)*page_number, limit: page_number}).exec(function(err, result) {
      if (err) return return3(res)
      res.status(200).json({
        code: 0,
        msg: '查找成功',
        data: result
      })
    })
  } else if (category) {
    category = escape(trim(category))
    Tag.find({name: category}).populate('Article',{skip: (page - 1)*page_number, limit: page_number}).exec(function(err, result) {
      if (err) return return3(res)
      res.status(200).json({
        code: 0,
        msg: '查找成功',
        data: result
      })
    })
  }
}

exports.addArticle = (req, res, next) => {
  const body = JSON.parse(req.body)
  let { title, path, summary, cover, markdown, category, tags, rendermd } = body
  title = escape(trim(title))
  path = escape(trim(path))
  summary = escape(trim(summary))
  cover = escape(trim(cover))
  category = escape(trim(category))
  if (!title) {
    return1('标题不能为空')
  } else if (!path) {
    return1('path 不能为空')
  } else if (!category) {
    return1('分类不能为空')
  } 
  // const 
}