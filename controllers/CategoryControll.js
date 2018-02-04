const {equals, isEmpty, trim, escape} = require('validator')
const Category = require('../models/Category')
const Article = require('../models/Article')
const async = require('async')
const {return0, return1, return2, return3} = require('./_response')

exports.addCategory = (req, res, next) => {
  if (typeof req.body.name !== 'string') {
    return return1('非法参数', res)
  }
  const name = escape(trim(req.body.name))
  if (isEmpty(name)) {
    return return1('name不能为空。', res)
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

exports.handleOneCategory = (req, res, next) => {
  if (!req.params.id) {
    return return1('id不能为空', res)
  }
  const id = escape(trim(req.params.id))
  const method = req.method
  if (method === 'DELETE') {
    async.parallel({
      category: function (cb) {
        Category
          .findById(id)
          .exec(cb)
      },
      articles: function (cb) {
        Article
          .find({'category': id})
          .exec(cb)
      }
    }, function (err, result) {
      if (err) {
        console.log(err); // 这里已经对错误进行处理，但是如果传入错误的 ObjectId，依然导致程序崩溃？？
        return return1('id不合法',res)
      }
      if (!result.category) {
        return return1('id不存在', res)
      } else if (result.articles.length > 0) {
        return return1(`该分类下有 ${result.articles.length} 篇文章，不能删除。`, res)
      } else {
        Category
          .findByIdAndRemove(id, function (err) {
            if (err) 
              return return3(res)
            return return0({}, res)
          })
      }
    })
  } else if (method === 'PUT') {
    const name = escape(trim(req.body.name))
    if (isEmpty(name)) {
      return return1('name不能为空。', res)
    }
    Category.find({name: name}, function(err, result) {
      if (err) {
        return return3(res)
      } else if (result.length > 0) {
        return return1('该分类已存在', res)
      } else {
        Category.findByIdAndUpdate(id, {$set: {name: name}}, function(err, result) {
          if (err) {
            return return3(res)
          }
          return0({}, res)
        })
      }
    })
  } else if (method === 'GET') {
    let {page, page_size} = req.query
    page = Number(page) || 1
    page_size = Number(page_size) || 10
    async.parallel({
      category: function (cb) {
        Category.findById(id).exec(cb)
      },
      articles: function (cb) {
        Article.find({category: id}, {}, {skip: ( page - 1) * page_size, limit: page_size}).exec(cb)
      }
    }, function(err, result) {
      if (err) {
        return return3(res)
      }
      const data = result.category
      data.articles = result.articles
      return return0(data, res)
    })
  } else {
    res.status(405).end()
  }
}


exports.getCategories = (req, res, next) => {
  Category
    .find({}, '_id name', function (err, result) {
      if (err) 
        return return3(res)
      const data = result.map(({_id, name}) => ({id: _id, name: name}))
      return return0(data, res)
    })
  }
  
  exports.getCategoryArticles = (req, res, next) => {
    const id = escape(trim(req.params.id))
  }
  
  exports.getFrontCategories = (reqq, res, next) => {
    let data
    Category
      .find({}, '_id name', function (err, result) {
        if (err) 
          return return3(res)
        // 获取分类后再并行获取分类下面的文章数
        const funcs = result.map(cate => cb => Article.count({category: cate._id}).exec(cb))
        async.parallel(funcs, function(err, nums) {
          data = result.map(({_id, name}, index) => ({id: _id, name: name, counts: nums[index]}))
          return return0(data, res)
        })
      })
  // const 
}