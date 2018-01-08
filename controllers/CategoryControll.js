const {equals, isEmpty, trim, escape} = require('validator')
const Category = require('../models/Category.js')
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
  console.log(newCategory)
  newCategory.save(function (err) {
    if (err) {
      return3(res)
    } else {
      return0({}, res)

    }
  })
}