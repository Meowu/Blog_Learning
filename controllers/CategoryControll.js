const {equals, isEmpty, trim, escape} = require('validator')
const Category = require('../models/Category')
const Article = require('../models/Article')
const {return0, return1, return2, return3} = require('./_response')

exports.addCategory = (req, res, next) => {
  if (typeof req.body.name !== 'string') {
    return1('非法参数', res)
  }
  const name = escape(trim(req.body.name))
  if (isEmpty(name)) {
    return1('name不能为空。', res)
  }
  const newCategory = new Category({name: name})
  newCategory.save(function (err) {
    if (err) {
      return3(res)
    } else {
      return0({}, res)
    }
  })
}
exports.deleteCategory = (req, res, next) => {
  const id = escape(trim(req.body.id))
  if (!id) {
    return1('id不能为空')
  }
  Category.findById(id, function(err, result) {
    if (err) return3(res)
    if (!result) {
      return1('id不存在')
    }
  })
  Article.find({'category': id}, function(err, result) {
    if (err) return3(res)
    if (result) {
      return1(`该分类下有 ${result.length} 篇文章，不能删除。`)
    } else {
      Category.findByIdAndRemove(id, function(err) {
        if (err) return3(res)
        return0({}, res)
      })
    }
  })
}

exports.getCategories = (req, res, next) => {
  Category.find({}, '_id name counts', function(err, result) {
    if (err) return3(res)
    return0(result, res)
  })
}

exports.getCategoryArticles = (req, res, next) => {
  const id = escape(trim(req.params.id))
  let { page, page_size } = req.query
  page = Number(page) || 1
  page_size = Number(page_size) || 10
  Category.findById(id).populate('articles').exec(function(err, result) {
    if (err) return3(res)
    if (!result) {
      return1('id不存在', res)
    } else {
      console.log(result);
      return0(result, res)
    }
  })
}