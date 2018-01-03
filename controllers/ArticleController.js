const Article = require('../models/Article')
const Tag = require('../models/Tag')

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
  let { page, page_number, tag_name, filterByYear, type } = req.body
  page = Number(page) || 1
  page_number = Number(page_number) || 10
  if (tag_name) {
    tag_name = escape(trim(tag_name))
    Tag.find({name: tag_name}).populate('Article',{skip: (page - 1)*page_number, limit: page_number}).exec(function(err, result) {
      if (err) return next(err)
      res.status(200).json({
        code: 0,
        msg: '查找成功'，
        data: result
      })
    })
  }
}